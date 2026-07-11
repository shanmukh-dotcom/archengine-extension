import * as vscode from 'vscode';

export class Logger {
  private static channel: vscode.OutputChannel;

  public static init() {
    if (!this.channel) {
      this.channel = vscode.window.createOutputChannel('ArchEngine');
    }
    this.info('ArchEngine Logger Initialized.');
  }

  public static info(message: string) {
    this.write('INFO', message);
  }

  public static warn(message: string) {
    this.write('WARN', message);
  }

  public static error(message: string, error?: any) {
    this.write('ERROR', `${message} ${error ? String(error) : ''}`);
  }

  private static write(level: string, message: string) {
    if (this.channel) {
      this.channel.appendLine(`[${new Date().toISOString()}] [${level}] ${message}`);
    } else {
      console.log(`[ArchEngine][${level}] ${message}`);
    }
  }
}
