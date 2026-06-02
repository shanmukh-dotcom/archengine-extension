import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { SettingsService } from '../services/settings';
import { Logger } from '../services/logger';
import * as path from 'path';
import { promises as fs } from 'fs';

const execAsync = promisify(exec);

export class GitEngine {
  public async pushToGitHub(rootPath: string): Promise<void> {
    const repoUrl = SettingsService.getGithubRepoUrl();

    if (!repoUrl || repoUrl.trim() === '') {
      vscode.window.showErrorMessage('AutoDev: Please configure your GitHub Repository URL in the settings first.');
      return;
    }

    try {
      vscode.window.showInformationMessage('AutoDev: Initializing and pushing to GitHub...');
      
      // 1. Check if git exists
      const gitPath = path.join(rootPath, '.git');
      try {
        await fs.stat(gitPath);
      } catch {
        // Not a git repo, init
        Logger.info('Initializing git repository...');
        await execAsync('git init', { cwd: rootPath });
      }

      // 2. Add and Commit
      Logger.info('Staging and committing files...');
      await execAsync('git add .', { cwd: rootPath });
      
      // Commit might fail if there are no changes, so we catch it silently
      try {
        await execAsync('git commit -m "AutoDev: Architecture & Features update"', { cwd: rootPath });
      } catch (err: any) {
        if (!err.message.includes('nothing to commit')) {
          throw err;
        }
      }

      // 3. Set remote origin
      Logger.info('Setting remote origin...');
      try {
        await execAsync(`git remote add origin ${repoUrl}`, { cwd: rootPath });
      } catch (err: any) {
        // If origin already exists, set-url instead
        if (err.message.includes('already exists')) {
          await execAsync(`git remote set-url origin ${repoUrl}`, { cwd: rootPath });
        } else {
          throw err;
        }
      }

      // 4. Push to main (or master)
      Logger.info('Pushing to GitHub...');
      try {
        await execAsync('git branch -M main', { cwd: rootPath });
        await execAsync('git push -u origin main', { cwd: rootPath });
      } catch (err: any) {
        throw new Error(`Failed to push: ${err.message}`);
      }

      vscode.window.showInformationMessage('AutoDev: Successfully pushed to GitHub!');
      Logger.info('Successfully pushed to GitHub.');

    } catch (error: any) {
      Logger.error('Git push failed', error);
      
      // Handle the case where Git is simply not installed
      if (error.message && error.message.includes('ENOENT')) {
        vscode.window.showErrorMessage('AutoDev: Git is not installed or not found in your system path. Please install Git to use this feature.');
      } else {
        vscode.window.showErrorMessage(`AutoDev GitHub Error: ${error.message}`);
      }
    }
  }
}
