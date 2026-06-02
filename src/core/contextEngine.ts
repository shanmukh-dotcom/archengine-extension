import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../services/logger';

export interface WorkspaceContext {
  isEmpty: boolean;
  rootPath: string | null;
  existingFramework?: string;
  existingDependencies: string[];
}

export class ContextEngine {
  public async analyzeWorkspace(): Promise<WorkspaceContext> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return { isEmpty: true, rootPath: null, existingDependencies: [] };
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    let isEmpty = true;
    let existingDependencies: string[] = [];
    let existingFramework: string | undefined = undefined;

    try {
      const files = await fs.readdir(rootPath);
      if (files.length > 0) {
        // Ignore just .vscode or .git
        const significantFiles = files.filter(f => !f.startsWith('.') && f !== 'node_modules');
        if (significantFiles.length > 0) {
          isEmpty = false;
        }
      }

      // Check for package.json to infer framework
      const pkgPath = path.join(rootPath, 'package.json');
      try {
        const pkgData = await fs.readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgData);
        
        const deps = Object.keys(pkg.dependencies || {});
        const devDeps = Object.keys(pkg.devDependencies || {});
        existingDependencies = [...deps, ...devDeps];

        if (existingDependencies.includes('next')) existingFramework = 'Next.js';
        else if (existingDependencies.includes('react')) existingFramework = 'React';
        else if (existingDependencies.includes('express')) existingFramework = 'Express';

      } catch (e) {
        // package.json doesn't exist or is invalid
      }

    } catch (error) {
      Logger.error('ContextEngine failed to read workspace', error);
    }

    Logger.info(`Workspace Context: isEmpty=${isEmpty}, framework=${existingFramework || 'Unknown'}`);
    return { isEmpty, rootPath, existingFramework, existingDependencies };
  }
}
