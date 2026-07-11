import * as vscode from 'vscode';

export class SettingsService {
  public static getApiKey(provider: string): string | undefined {
    const config = vscode.workspace.getConfiguration('archengine');
    return config.get<string>(`${provider}ApiKey`);
  }

  public static getGithubRepoUrl(): string | undefined {
    const config = vscode.workspace.getConfiguration('archengine');
    return config.get<string>('githubRepoUrl');
  }

  public static async setApiKey(provider: string, key: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('archengine');
    await config.update(`${provider}ApiKey`, key, vscode.ConfigurationTarget.Global);
  }
}
