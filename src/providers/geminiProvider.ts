import { ProjectIntent } from '../models/blueprint';
import { Logger } from '../services/logger';
import * as https from 'https';

export class GeminiProvider {
  constructor(private apiKey: string) {}

  public async parsePrompt(prompt: string): Promise<ProjectIntent> {
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
      Logger.info('GeminiProvider: Sending request to Gemini API...');
      
      const data = await new Promise<any>((resolve, reject) => {
        const payloadString = JSON.stringify(payload);
        const req = https.request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payloadString)
          }
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(body));
            } else {
              reject(new Error(`Gemini API error: ${res.statusCode} ${res.statusMessage}`));
            }
          });
        });
        req.on('error', reject);
        req.write(payloadString);
        req.end();
      });

      const jsonText = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(jsonText);
      
      return {
        projectType: parsed.projectType || 'Generic Project',
        framework: parsed.framework || 'Node.js',
        database: parsed.database,
        features: parsed.features || [],
        rawPrompt: prompt
      };
    } catch (error) {
      Logger.error('GeminiProvider: Failed to parse prompt.', error);
      throw error;
    }
  }
}
