"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewPanel = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const logger_1 = require("../services/logger");
class ReviewPanel {
    extensionPath;
    generationEngine;
    static currentPanel;
    panel;
    currentBlueprint;
    constructor(panel, extensionPath, generationEngine) {
        this.extensionPath = extensionPath;
        this.generationEngine = generationEngine;
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
    static async createOrShow(extensionPath, blueprint, generationEngine) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (ReviewPanel.currentPanel) {
            ReviewPanel.currentPanel.panel.reveal(column);
            await ReviewPanel.currentPanel.update(blueprint);
            return;
        }
        const panel = vscode.window.createWebviewPanel('archengineReview', 'ArchEngine Architecture Review', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'ui'))]
        });
        ReviewPanel.currentPanel = new ReviewPanel(panel, extensionPath, generationEngine);
        await ReviewPanel.currentPanel.update(blueprint);
    }
    async update(blueprint) {
        this.currentBlueprint = blueprint;
        this.panel.webview.html = await this.getHtmlForWebview(blueprint);
    }
    async getHtmlForWebview(blueprint) {
        try {
            const htmlPath = path.join(this.extensionPath, 'src', 'ui', 'review.html');
            let html = await fs_1.promises.readFile(htmlPath, 'utf8');
            // Inject data into HTML
            const blueprintJson = JSON.stringify(blueprint).replace(/</g, '\\u003c');
            html = html.replace('<!-- INJECT_BLUEPRINT -->', `<script>window.initialBlueprint = ${blueprintJson};</script>`);
            return html;
        }
        catch (err) {
            logger_1.Logger.error('Failed to load review.html', err);
            return '<html><body>Error loading UI</body></html>';
        }
    }
    dispose() {
        ReviewPanel.currentPanel = undefined;
        this.panel.dispose();
    }
}
exports.ReviewPanel = ReviewPanel;
//# sourceMappingURL=reviewPanel.js.map