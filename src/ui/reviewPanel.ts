import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Blueprint } from '../models/blueprint';
import { GenerationEngine } from '../core/generationEngine';
import { Logger } from '../services/logger';

export class ReviewPanel {
  public static currentPanel: ReviewPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private currentBlueprint: Blueprint | undefined;

  private constructor(panel: vscode.WebviewPanel, private extensionPath: string, private generationEngine: GenerationEngine) {
    this.panel = panel;
    
    this.panel.onDidDispose(() => this.dispose());
    
    this.panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'approve':
          if (this.currentBlueprint) {
            await this.generationEngine.generateWorkspace(this.currentBlueprint);
            this.panel.dispose();
          }
          break;
        case 'cancel':
          this.panel.dispose();
          break;
      }
    });
  }

  public static async createOrShow(extensionPath: string, blueprint: Blueprint, generationEngine: GenerationEngine) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (ReviewPanel.currentPanel) {
      ReviewPanel.currentPanel.panel.reveal(column);
      await ReviewPanel.currentPanel.update(blueprint);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'archengineReview',
      'ArchEngine Architecture Review',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'ui'))]
      }
    );

    ReviewPanel.currentPanel = new ReviewPanel(panel, extensionPath, generationEngine);
    await ReviewPanel.currentPanel.update(blueprint);
  }

  private async update(blueprint: Blueprint) {
    this.currentBlueprint = blueprint;
    this.panel.webview.html = await this.getHtmlForWebview(blueprint);
  }

  private async getHtmlForWebview(blueprint: Blueprint): Promise<string> {
    try {
      const htmlPath = path.join(this.extensionPath, 'src', 'ui', 'review.html');
      let html = await fs.readFile(htmlPath, 'utf8');
      
      // Inject data into HTML
      const blueprintJson = JSON.stringify(blueprint).replace(/</g, '\\u003c');
      html = html.replace('<!-- INJECT_BLUEPRINT -->', `<script>window.initialBlueprint = ${blueprintJson};</script>`);
      return html;
    } catch (err) {
      Logger.error('Failed to load review.html', err);
      return '<html><body>Error loading UI</body></html>';
    }
  }

  public dispose() {
    ReviewPanel.currentPanel = undefined;
    this.panel.dispose();
  }
}
