import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../services/logger';

interface SessionData {
  totalMinutes: number;
  lastStartTime: number | null;
}

export class SessionEngine {
  private getStoragePath(rootPath: string): string {
    return path.join(rootPath, '.autodev', 'session.json');
  }

  public async startSession(rootPath: string): Promise<void> {
    const data = await this.readData(rootPath);
    data.lastStartTime = Date.now();
    await this.writeData(rootPath, data);
    Logger.info('Coding session started.');
    vscode.window.showInformationMessage('AutoDev: Coding session started. Tracking time...');
  }

  public async stopSession(rootPath: string): Promise<void> {
    const data = await this.readData(rootPath);
    if (data.lastStartTime) {
      const elapsedMs = Date.now() - data.lastStartTime;
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      data.totalMinutes += elapsedMinutes;
      data.lastStartTime = null;
      await this.writeData(rootPath, data);
      Logger.info(`Coding session stopped. Logged ${elapsedMinutes} minutes.`);
      vscode.window.showInformationMessage(`AutoDev: Session stopped. Total time: ${data.totalMinutes} minutes.`);
    } else {
      vscode.window.showWarningMessage('AutoDev: No active session found to stop.');
    }
  }

  public async getTotalTime(rootPath: string): Promise<number> {
    const data = await this.readData(rootPath);
    return data.totalMinutes;
  }

  private async readData(rootPath: string): Promise<SessionData> {
    try {
      const p = this.getStoragePath(rootPath);
      const content = await fs.readFile(p, 'utf8');
      return JSON.parse(content);
    } catch {
      return { totalMinutes: 0, lastStartTime: null };
    }
  }

  private async writeData(rootPath: string, data: SessionData): Promise<void> {
    const p = this.getStoragePath(rootPath);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
  }
}
