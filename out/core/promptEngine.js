"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptEngine = void 0;
const logger_1 = require("../services/logger");
const localProvider_1 = require("../providers/localProvider");
const geminiProvider_1 = require("../providers/geminiProvider");
const settings_1 = require("../services/settings");
class PromptEngine {
    localProvider;
    constructor() {
        this.localProvider = new localProvider_1.LocalProvider();
    }
    async processPrompt(prompt) {
        logger_1.Logger.info(`PromptEngine processing prompt: "${prompt}"`);
        const geminiKey = settings_1.SettingsService.getApiKey('gemini');
        if (geminiKey && geminiKey.trim() !== '') {
            logger_1.Logger.info('API Key found. Routing to GeminiProvider...');
            try {
                const geminiProvider = new geminiProvider_1.GeminiProvider(geminiKey);
                const intent = await geminiProvider.parsePrompt(prompt);
                logger_1.Logger.info(`Parsed Intent (Gemini): ${JSON.stringify(intent)}`);
                return intent;
            }
            catch (error) {
                logger_1.Logger.warn('GeminiProvider failed, falling back to LocalProvider...');
            }
        }
        logger_1.Logger.info('Routing to LocalProvider fallback...');
        const intent = await this.localProvider.parsePrompt(prompt);
        logger_1.Logger.info(`Parsed Intent (Local): ${JSON.stringify(intent)}`);
        return intent;
    }
}
exports.PromptEngine = PromptEngine;
//# sourceMappingURL=promptEngine.js.map