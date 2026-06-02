import * as vscode from 'vscode';
import { Logger } from '../services/logger';

import { PromptEngine } from '../core/promptEngine';
import { BlueprintEngine } from '../core/blueprintEngine';
import { GenerationEngine } from '../core/generationEngine';
import { ReviewPanel } from '../ui/reviewPanel';
import { ContextEngine } from '../core/contextEngine';
import { AdvisorEngine } from '../core/advisorEngine';
import { SessionEngine } from '../core/sessionEngine';
import { NotesEngine } from '../core/notesEngine';
import { ResumeGenerator } from '../core/resumeGenerator';
import { GitEngine } from '../core/gitEngine';

export function activate(context: vscode.ExtensionContext) {
  Logger.init();
  Logger.info('AutoDev Project Architecture Engine Activated.');

  const promptEngine = new PromptEngine();
  const blueprintEngine = new BlueprintEngine();
  const generationEngine = new GenerationEngine();
  const contextEngine = new ContextEngine();
  const advisorEngine = new AdvisorEngine();

  const scaffoldCmd = vscode.commands.registerCommand('autodev.scaffoldProject', async () => {
    
    const contextInfo = await contextEngine.analyzeWorkspace();
    if (!contextInfo.rootPath) {
      vscode.window.showErrorMessage('AutoDev: Please open a folder to generate or expand a project.');
      return;
    }

    const mode = contextInfo.isEmpty ? 'Scaffold New Project' : `Expand Project (${contextInfo.existingFramework || 'Unknown Framework'})`;

    const input = await vscode.window.showInputBox({ 
      prompt: `[Mode: ${mode}] Describe your project/feature...`,
      placeHolder: contextInfo.isEmpty ? 'e.g. Build an Express backend...' : 'e.g. Add JWT authentication...'
    });

    if (!input) return;

    vscode.window.showInformationMessage('AutoDev: Analyzing project intent...');
    
    try {
      const intent = await promptEngine.processPrompt(input);
      const blueprint = blueprintEngine.generateBlueprint(intent);
      
      // Generate Architecture Advice
      vscode.window.showInformationMessage('AutoDev: Generating Architectural Advice...');
      const advice = await advisorEngine.generateAdvice(intent);
      blueprint.files.push({
        path: 'ARCHITECTURE.md',
        content: advice,
        reason: 'Architectural overview, design patterns, and scalability advice.'
      });

      // Phase 2: Route to Review UI instead of generating directly
      await ReviewPanel.createOrShow(context.extensionPath, blueprint, generationEngine);
    } catch (err: any) {
      Logger.error('Scaffold failed:', err);
      vscode.window.showErrorMessage(`AutoDev Error: ${err.message}`);
    }
  });

  const sessionEngine = new SessionEngine();
  const sessionCmd = vscode.commands.registerCommand('autodev.startSession', async () => {
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('AutoDev: Please open a folder to start a coding session.');
      return;
    }

    const action = await vscode.window.showQuickPick(['Start Session', 'Stop Session']);
    if (action === 'Start Session') await sessionEngine.startSession(rootPath);
    if (action === 'Stop Session') await sessionEngine.stopSession(rootPath);
  });

  const notesEngine = new NotesEngine();
  const notesCmd = vscode.commands.registerCommand('autodev.logNote', async () => {
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('AutoDev: Please open a folder to log developer notes.');
      return;
    }

    const input = await vscode.window.showInputBox({ prompt: 'Log a blocker or accomplishment for your resume...' });
    if (input) await notesEngine.logNote(rootPath, input);
  });

  const resumeGenerator = new ResumeGenerator();
  const resumeCmd = vscode.commands.registerCommand('autodev.generateResume', async () => {
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('AutoDev: Please open a folder to generate a developer resume.');
      return;
    }
    await resumeGenerator.generateResume(rootPath);
  });

  const gitEngine = new GitEngine();
  const githubCmd = vscode.commands.registerCommand('autodev.pushToGithub', async () => {
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('AutoDev: Please open a folder before pushing to GitHub.');
      return;
    }
    await gitEngine.pushToGitHub(rootPath);
  });

  context.subscriptions.push(scaffoldCmd, sessionCmd, notesCmd, resumeCmd, githubCmd);
}

export function deactivate() {}
