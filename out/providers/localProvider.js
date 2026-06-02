"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalProvider = void 0;
class LocalProvider {
    /**
     * A zero-cost fallback parser that uses simple heuristics to generate a ProjectIntent.
     */
    async parsePrompt(prompt) {
        const lower = prompt.toLowerCase();
        // Very basic keyword matching for V1 baseline
        let projectType = 'Generic Project';
        if (lower.includes('backend') || lower.includes('api'))
            projectType = 'Backend API';
        if (lower.includes('frontend') || lower.includes('ui'))
            projectType = 'Frontend App';
        if (lower.includes('fullstack') || lower.includes('saas'))
            projectType = 'Fullstack SaaS';
        let framework = 'Node.js';
        if (lower.includes('express'))
            framework = 'Express';
        if (lower.includes('next.js') || lower.includes('nextjs'))
            framework = 'Next.js';
        if (lower.includes('react'))
            framework = 'React';
        let database = undefined;
        if (lower.includes('postgres') || lower.includes('postgresql'))
            database = 'PostgreSQL';
        if (lower.includes('mongo') || lower.includes('mongodb'))
            database = 'MongoDB';
        const features = [];
        if (lower.includes('auth') || lower.includes('jwt'))
            features.push('Authentication');
        if (lower.includes('stripe') || lower.includes('payment'))
            features.push('Payments');
        return {
            projectType,
            framework,
            database,
            features,
            rawPrompt: prompt
        };
    }
}
exports.LocalProvider = LocalProvider;
//# sourceMappingURL=localProvider.js.map