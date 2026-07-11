"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionEngine = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const logger_1 = require("../services/logger");
class SessionEngine {
    getStoragePath(rootPath) {
        return path.join(rootPath, '.archengine', 'session.json');
    }
    async startSession(rootPath) {
        const data = await this.readData(rootPath);
        data.lastStartTime = Date.now();
        await this.writeData(rootPath, data);
        logger_1.Logger.info('Coding session started.');
        vscode.window.showInformationMessage('ArchEngine: Coding session started. Tracking time...');
    }
    async stopSession(rootPath) {
        const data = await this.readData(rootPath);
        if (data.lastStartTime) {
            const elapsedMs = Date.now() - data.lastStartTime;
            const elapsedMinutes = Math.floor(elapsedMs / 60000);
            data.totalMinutes += elapsedMinutes;
            data.lastStartTime = null;
            await this.writeData(rootPath, data);
            logger_1.Logger.info(`Coding session stopped. Logged ${elapsedMinutes} minutes.`);
            vscode.window.showInformationMessage(`ArchEngine: Session stopped. Total time: ${data.totalMinutes} minutes.`);
        }
        else {
            vscode.window.showWarningMessage('ArchEngine: No active session found to stop.');
        }
    }
    async getTotalTime(rootPath) {
        const data = await this.readData(rootPath);
        return data.totalMinutes;
    }
    async readData(rootPath) {
        try {
            const p = this.getStoragePath(rootPath);
            const content = await fs_1.promises.readFile(p, 'utf8');
            return JSON.parse(content);
        }
        catch {
            return { totalMinutes: 0, lastStartTime: null };
        }
    }
    async writeData(rootPath, data) {
        const p = this.getStoragePath(rootPath);
        await fs_1.promises.mkdir(path.dirname(p), { recursive: true });
        await fs_1.promises.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
    }
}
exports.SessionEngine = SessionEngine;
//# sourceMappingURL=sessionEngine.js.map