"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const vscode = require("vscode");
class SettingsService {
    static getApiKey(provider) {
        const config = vscode.workspace.getConfiguration('archengine');
        return config.get(`${provider}ApiKey`);
    }
    static getGithubRepoUrl() {
        const config = vscode.workspace.getConfiguration('archengine');
        return config.get('githubRepoUrl');
    }
    static async setApiKey(provider, key) {
        const config = vscode.workspace.getConfiguration('archengine');
        await config.update(`${provider}ApiKey`, key, vscode.ConfigurationTarget.Global);
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.js.map