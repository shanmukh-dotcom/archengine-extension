"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEngine = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const logger_1 = require("../services/logger");
class ContextEngine {
    async analyzeWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return { isEmpty: true, rootPath: null, existingDependencies: [] };
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        let isEmpty = true;
        let existingDependencies = [];
        let existingFramework = undefined;
        try {
            const files = await fs_1.promises.readdir(rootPath);
            if (files.length > 0) {
                // Ignore just .vscode or .git
                const significantFiles = files.filter(f => !f.startsWith('.') && f !== 'node_modules');
                if (significantFiles.length > 0) {
                    isEmpty = false;
                }
            }
            // Check for package.json to infer framework
            const pkgPath = path.join(rootPath, 'package.json');
            try {
                const pkgData = await fs_1.promises.readFile(pkgPath, 'utf8');
                const pkg = JSON.parse(pkgData);
                const deps = Object.keys(pkg.dependencies || {});
                const devDeps = Object.keys(pkg.devDependencies || {});
                existingDependencies = [...deps, ...devDeps];
                if (existingDependencies.includes('next'))
                    existingFramework = 'Next.js';
                else if (existingDependencies.includes('react'))
                    existingFramework = 'React';
                else if (existingDependencies.includes('express'))
                    existingFramework = 'Express';
            }
            catch (e) {
                // package.json doesn't exist or is invalid
            }
        }
        catch (error) {
            logger_1.Logger.error('ContextEngine failed to read workspace', error);
        }
        logger_1.Logger.info(`Workspace Context: isEmpty=${isEmpty}, framework=${existingFramework || 'Unknown'}`);
        return { isEmpty, rootPath, existingFramework, existingDependencies };
    }
}
exports.ContextEngine = ContextEngine;
//# sourceMappingURL=contextEngine.js.map