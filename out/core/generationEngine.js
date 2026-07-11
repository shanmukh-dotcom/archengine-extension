"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationEngine = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const logger_1 = require("../services/logger");
class GenerationEngine {
    async generateWorkspace(blueprint) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder to generate the project.');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        logger_1.Logger.info(`Generating workspace at ${rootPath}`);
        for (const file of blueprint.files) {
            const fullPath = path.join(rootPath, file.path);
            try {
                await fs_1.promises.mkdir(path.dirname(fullPath), { recursive: true });
                // Safety lock: Do not overwrite existing files
                try {
                    await fs_1.promises.stat(fullPath);
                    logger_1.Logger.warn(`File ${file.path} already exists. Skipping.`);
                    continue;
                }
                catch (e) {
                    // File does not exist, safe to write
                }
                await fs_1.promises.writeFile(fullPath, file.content, 'utf8');
                logger_1.Logger.info(`Created: ${file.path}`);
            }
            catch (error) {
                logger_1.Logger.error(`Failed to create ${file.path}`, error);
            }
        }
        // Write or merge package.json
        const packageJsonPath = path.join(rootPath, 'package.json');
        let existingPkg = {};
        try {
            const pkgData = await fs_1.promises.readFile(packageJsonPath, 'utf8');
            try {
                existingPkg = JSON.parse(pkgData);
                logger_1.Logger.info('Found existing package.json. Merging dependencies...');
            }
            catch (jsonErr) {
                vscode.window.showErrorMessage('ArchEngine: Your existing package.json has a syntax error. We cannot safely expand this project. Please fix it and try again.');
                return;
            }
        }
        catch {
            existingPkg = {
                name: 'archengine-generated-project',
                version: '1.0.0',
                dependencies: {},
                devDependencies: {}
            };
            logger_1.Logger.info('No package.json found. Creating new one...');
        }
        existingPkg.dependencies = existingPkg.dependencies || {};
        existingPkg.devDependencies = existingPkg.devDependencies || {};
        blueprint.dependencies.forEach(dep => {
            if (!existingPkg.dependencies[dep])
                existingPkg.dependencies[dep] = '*';
        });
        blueprint.devDependencies.forEach(dep => {
            if (!existingPkg.devDependencies[dep] && !existingPkg.dependencies[dep]) {
                existingPkg.devDependencies[dep] = '*';
            }
        });
        await fs_1.promises.writeFile(packageJsonPath, JSON.stringify(existingPkg, null, 2), 'utf8');
        logger_1.Logger.info('Updated: package.json');
        vscode.window.showInformationMessage('ArchEngine: Project successfully generated/expanded!');
    }
}
exports.GenerationEngine = GenerationEngine;
//# sourceMappingURL=generationEngine.js.map