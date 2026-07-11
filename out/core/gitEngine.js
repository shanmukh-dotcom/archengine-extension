"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitEngine = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const util_1 = require("util");
const settings_1 = require("../services/settings");
const logger_1 = require("../services/logger");
const path = require("path");
const fs_1 = require("fs");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class GitEngine {
    async pushToGitHub(rootPath) {
        const repoUrl = settings_1.SettingsService.getGithubRepoUrl();
        if (!repoUrl || repoUrl.trim() === '') {
            vscode.window.showErrorMessage('ArchEngine: Please configure your GitHub Repository URL in the settings first.');
            return;
        }
        try {
            vscode.window.showInformationMessage('ArchEngine: Initializing and pushing to GitHub...');
            // 1. Check if git exists
            const gitPath = path.join(rootPath, '.git');
            try {
                await fs_1.promises.stat(gitPath);
            }
            catch {
                // Not a git repo, init
                logger_1.Logger.info('Initializing git repository...');
                await execAsync('git init', { cwd: rootPath });
            }
            // 2. Add and Commit
            logger_1.Logger.info('Staging and committing files...');
            await execAsync('git add .', { cwd: rootPath });
            // Commit might fail if there are no changes, so we catch it silently
            try {
                await execAsync('git commit -m "ArchEngine: Architecture & Features update"', { cwd: rootPath });
            }
            catch (err) {
                if (!err.message.includes('nothing to commit')) {
                    throw err;
                }
            }
            // 3. Set remote origin
            logger_1.Logger.info('Setting remote origin...');
            try {
                await execAsync(`git remote add origin ${repoUrl}`, { cwd: rootPath });
            }
            catch (err) {
                // If origin already exists, set-url instead
                if (err.message.includes('already exists')) {
                    await execAsync(`git remote set-url origin ${repoUrl}`, { cwd: rootPath });
                }
                else {
                    throw err;
                }
            }
            // 4. Push to main (or master)
            logger_1.Logger.info('Pushing to GitHub...');
            try {
                await execAsync('git branch -M main', { cwd: rootPath });
                await execAsync('git push -u origin main', { cwd: rootPath });
            }
            catch (err) {
                throw new Error(`Failed to push: ${err.message}`);
            }
            vscode.window.showInformationMessage('ArchEngine: Successfully pushed to GitHub!');
            logger_1.Logger.info('Successfully pushed to GitHub.');
        }
        catch (error) {
            logger_1.Logger.error('Git push failed', error);
            // Handle the case where Git is simply not installed
            if (error.message && error.message.includes('ENOENT')) {
                vscode.window.showErrorMessage('ArchEngine: Git is not installed or not found in your system path. Please install Git to use this feature.');
            }
            else {
                vscode.window.showErrorMessage(`ArchEngine GitHub Error: ${error.message}`);
            }
        }
    }
}
exports.GitEngine = GitEngine;
//# sourceMappingURL=gitEngine.js.map