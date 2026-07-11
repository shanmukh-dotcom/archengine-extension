"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueprintEngine = void 0;
const logger_1 = require("../services/logger");
const templateRegistry_1 = require("./templateRegistry");
class BlueprintEngine {
    generateBlueprint(intent) {
        logger_1.Logger.info('BlueprintEngine dynamically generating architecture...');
        const files = [];
        const dependencies = [];
        const devDependencies = [];
        // Base README
        files.push({
            path: 'README.md',
            content: `# ${intent.projectType}\n\nGenerated dynamically by ArchEngine Template Registry.\n\nFramework: ${intent.framework}\nDatabase: ${intent.database || 'None'}\nFeatures: ${intent.features.join(', ') || 'None'}`,
            reason: 'Root documentation file outlining project stack.'
        });
        // 1. Resolve Framework
        const frameworkModule = templateRegistry_1.TemplateRegistry.getFramework(intent.framework);
        if (frameworkModule) {
            files.push(...(frameworkModule.files || []));
            dependencies.push(...(frameworkModule.dependencies || []));
            devDependencies.push(...(frameworkModule.devDependencies || []));
        }
        else {
            logger_1.Logger.warn(`No template found for framework: ${intent.framework}`);
            // Generic fallback
            files.push({ path: 'src/index.ts', content: '// Entry point', reason: 'Generic entry point' });
        }
        // 2. Resolve Database
        if (intent.database) {
            const dbModule = templateRegistry_1.TemplateRegistry.getDatabase(intent.database);
            if (dbModule) {
                files.push(...(dbModule.files || []));
                dependencies.push(...(dbModule.dependencies || []));
                devDependencies.push(...(dbModule.devDependencies || []));
            }
            else {
                logger_1.Logger.warn(`No template found for database: ${intent.database}`);
            }
        }
        logger_1.Logger.info(`Generated blueprint stitching ${files.length} files.`);
        return {
            intent,
            files,
            // Deduplicate arrays just in case multiple modules share a dependency
            dependencies: [...new Set(dependencies)],
            devDependencies: [...new Set(devDependencies)],
            confidenceScore: frameworkModule ? 95 : 50
        };
    }
}
exports.BlueprintEngine = BlueprintEngine;
//# sourceMappingURL=blueprintEngine.js.map