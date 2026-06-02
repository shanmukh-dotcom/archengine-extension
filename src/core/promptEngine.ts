import { Logger } from '../services/logger';
import { ProjectIntent } from '../models/blueprint';
import { LocalProvider } from '../providers/localProvider';
import { GeminiProvider } from '../providers/geminiProvider';
import { SettingsService } from '../services/settings';

export class PromptEngine {
  private localProvider: LocalProvider;

  constructor() {
    this.localProvider = new LocalProvider();
  }

  public async processPrompt(prompt: string): Promise<ProjectIntent> {
    Logger.info(`PromptEngine processing prompt: "${prompt}"`);
    
    const geminiKey = SettingsService.getApiKey('gemini');
    
    if (geminiKey && geminiKey.trim() !== '') {
      Logger.info('API Key found. Routing to GeminiProvider...');
      try {
        const geminiProvider = new GeminiProvider(geminiKey);
        const intent = await geminiProvider.parsePrompt(prompt);
        Logger.info(`Parsed Intent (Gemini): ${JSON.stringify(intent)}`);
        return intent;
      } catch (error) {
        Logger.warn('GeminiProvider failed, falling back to LocalProvider...');
      }
    }

    Logger.info('Routing to LocalProvider fallback...');
    const intent = await this.localProvider.parsePrompt(prompt);
    
    Logger.info(`Parsed Intent (Local): ${JSON.stringify(intent)}`);
    return intent;
  }
}
