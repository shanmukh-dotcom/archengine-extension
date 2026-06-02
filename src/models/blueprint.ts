export interface ProjectIntent {
  projectType: string; // e.g., 'Backend API', 'Frontend App'
  framework: string; // e.g., 'Express', 'Next.js'
  database?: string; // e.g., 'PostgreSQL', 'MongoDB'
  features: string[]; // e.g., ['Authentication', 'Payments']
  rawPrompt: string;
}

export interface FileDefinition {
  path: string;
  content: string;
  reason: string;
}

export interface Blueprint {
  intent: ProjectIntent;
  files: FileDefinition[];
  dependencies: string[];
  devDependencies: string[];
  confidenceScore: number; // 0-100
}
