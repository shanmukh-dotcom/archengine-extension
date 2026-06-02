"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const logger_1 = require("../services/logger");
class GeminiProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async parsePrompt(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const systemInstruction = `You are a Senior Software Architect. Your job is to parse the user's natural language project idea and return a STRICT JSON object representing the project intent. DO NOT return markdown formatting, only pure JSON. The JSON must exactly match this interface:
{
  "projectType": string (e.g. "Backend API", "Frontend Application"),
  "framework": string (e.g. "Express", "Next.js", "Django"),
  "database": string (e.g. "PostgreSQL", "MongoDB", "None"),
  "features": string[] (list of features like "Authentication", "Payments", "Email")
}`;
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                responseMimeType: "application/json"
            }
        };
        try {
            logger_1.Logger.info('GeminiProvider: Sending request to Gemini API...');
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }
            const data = await response.json();
            const jsonText = data.candidates[0].content.parts[0].text;
            const parsed = JSON.parse(jsonText);
            return {
                projectType: parsed.projectType || 'Generic Project',
                framework: parsed.framework || 'Node.js',
                database: parsed.database,
                features: parsed.features || [],
                rawPrompt: prompt
            };
        }
        catch (error) {
            logger_1.Logger.error('GeminiProvider: Failed to parse prompt.', error);
            throw error;
        }
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=geminiProvider.js.map