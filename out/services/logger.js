"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const vscode = require("vscode");
class Logger {
    static channel;
    static init() {
        if (!this.channel) {
            this.channel = vscode.window.createOutputChannel('AutoDev');
        }
        this.info('AutoDev Logger Initialized.');
    }
    static info(message) {
        this.write('INFO', message);
    }
    static warn(message) {
        this.write('WARN', message);
    }
    static error(message, error) {
        this.write('ERROR', `${message} ${error ? String(error) : ''}`);
    }
    static write(level, message) {
        if (this.channel) {
            this.channel.appendLine(`[${new Date().toISOString()}] [${level}] ${message}`);
        }
        else {
            console.log(`[AutoDev][${level}] ${message}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map