"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const logger_1 = require("../services/logger");
const promptEngine_1 = require("../core/promptEngine");
const blueprintEngine_1 = require("../core/blueprintEngine");
const generationEngine_1 = require("../core/generationEngine");
const reviewPanel_1 = require("../ui/reviewPanel");
const contextEngine_1 = require("../core/contextEngine");
const advisorEngine_1 = require("../core/advisorEngine");
const sessionEngine_1 = require("../core/sessionEngine");
const notesEngine_1 = require("../core/notesEngine");
const resumeGenerator_1 = require("../core/resumeGenerator");
const gitEngine_1 = require("../core/gitEngine");
function activate(context) {
    logger_1.Logger.init();
    logger_1.Logger.info('ArchEngine Project Architecture Engine Activated.');
    const promptEngine = new promptEngine_1.PromptEngine();
    const blueprintEngine = new blueprintEngine_1.BlueprintEngine();
    const generationEngine = new generationEngine_1.GenerationEngine();
    const contextEngine = new contextEngine_1.ContextEngine();
    const advisorEngine = new advisorEngine_1.AdvisorEngine();
    const scaffoldCmd = vscode.commands.registerCommand('archengine.scaffoldProject', async () => {
        const contextInfo = await contextEngine.analyzeWorkspace();
        if (!contextInfo.rootPath) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder to generate or expand a project.');
            return;
        }
        const mode = contextInfo.isEmpty ? 'Scaffold New Project' : `Expand Project (${contextInfo.existingFramework || 'Unknown Framework'})`;
        const input = await vscode.window.showInputBox({
            prompt: `[Mode: ${mode}] Describe your project/feature...`,
            placeHolder: contextInfo.isEmpty ? 'e.g. Build an Express backend...' : 'e.g. Add JWT authentication...'
        });
        if (!input)
            return;
        vscode.window.showInformationMessage('ArchEngine: Analyzing project intent...');
        try {
            const intent = await promptEngine.processPrompt(input);
            const blueprint = blueprintEngine.generateBlueprint(intent);
            // Generate Architecture Advice
            vscode.window.showInformationMessage('ArchEngine: Generating Architectural Advice...');
            const advice = await advisorEngine.generateAdvice(intent);
            blueprint.files.push({
                path: 'ARCHITECTURE.md',
                content: advice,
                reason: 'Architectural overview, design patterns, and scalability advice.'
            });
            // Phase 2: Route to Review UI instead of generating directly
            await reviewPanel_1.ReviewPanel.createOrShow(context.extensionPath, blueprint, generationEngine);
        }
        catch (err) {
            logger_1.Logger.error('Scaffold failed:', err);
            vscode.window.showErrorMessage(`ArchEngine Error: ${err.message}`);
        }
    });
    const sessionEngine = new sessionEngine_1.SessionEngine();
    const sessionCmd = vscode.commands.registerCommand('archengine.startSession', async () => {
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!rootPath) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder to start a coding session.');
            return;
        }
        const action = await vscode.window.showQuickPick(['Start Session', 'Stop Session']);
        if (action === 'Start Session')
            await sessionEngine.startSession(rootPath);
        if (action === 'Stop Session')
            await sessionEngine.stopSession(rootPath);
    });
    const notesEngine = new notesEngine_1.NotesEngine();
    const notesCmd = vscode.commands.registerCommand('archengine.logNote', async () => {
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!rootPath) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder to log developer notes.');
            return;
        }
        const input = await vscode.window.showInputBox({ prompt: 'Log a blocker or accomplishment for your resume...' });
        if (input)
            await notesEngine.logNote(rootPath, input);
    });
    const resumeGenerator = new resumeGenerator_1.ResumeGenerator();
    const resumeCmd = vscode.commands.registerCommand('archengine.generateResume', async () => {
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!rootPath) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder to generate a developer resume.');
            return;
        }
        await resumeGenerator.generateResume(rootPath);
    });
    const gitEngine = new gitEngine_1.GitEngine();
    const githubCmd = vscode.commands.registerCommand('archengine.pushToGithub', async () => {
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!rootPath) {
            vscode.window.showErrorMessage('ArchEngine: Please open a folder before pushing to GitHub.');
            return;
        }
        await gitEngine.pushToGitHub(rootPath);
    });
    context.subscriptions.push(scaffoldCmd, sessionCmd, notesCmd, resumeCmd, githubCmd);
}
function deactivate() { }
//# sourceMappingURL=activation.js.map