"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesEngine = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const logger_1 = require("../services/logger");
class NotesEngine {
    getStoragePath(rootPath) {
        return path.join(rootPath, '.autodev', 'notes.json');
    }
    async logNote(rootPath, content) {
        const notes = await this.getNotes(rootPath);
        notes.push({
            timestamp: new Date().toISOString(),
            content
        });
        const p = this.getStoragePath(rootPath);
        await fs_1.promises.mkdir(path.dirname(p), { recursive: true });
        await fs_1.promises.writeFile(p, JSON.stringify(notes, null, 2), 'utf8');
        logger_1.Logger.info('Developer note logged successfully.');
        vscode.window.showInformationMessage('AutoDev: Note logged!');
    }
    async getNotes(rootPath) {
        try {
            const p = this.getStoragePath(rootPath);
            const content = await fs_1.promises.readFile(p, 'utf8');
            return JSON.parse(content);
        }
        catch {
            return [];
        }
    }
}
exports.NotesEngine = NotesEngine;
//# sourceMappingURL=notesEngine.js.map