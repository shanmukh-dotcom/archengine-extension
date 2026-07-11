import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../services/logger';

export interface DeveloperNote {
  timestamp: string;
  content: string;
}

export class NotesEngine {
  private getStoragePath(rootPath: string): string {
    return path.join(rootPath, '.archengine', 'notes.json');
  }

  public async logNote(rootPath: string, content: string): Promise<void> {
    const notes = await this.getNotes(rootPath);
    notes.push({
      timestamp: new Date().toISOString(),
      content
    });
    
    const p = this.getStoragePath(rootPath);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(notes, null, 2), 'utf8');
    
    Logger.info('Developer note logged successfully.');
    vscode.window.showInformationMessage('ArchEngine: Note logged!');
  }

  public async getNotes(rootPath: string): Promise<DeveloperNote[]> {
    try {
      const p = this.getStoragePath(rootPath);
      const content = await fs.readFile(p, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
}
