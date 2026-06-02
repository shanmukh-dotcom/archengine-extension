import { FileDefinition } from './blueprint';

export interface TemplateModule {
  name: string;
  files: FileDefinition[];
  dependencies: string[];
  devDependencies: string[];
  architectureAdvice?: string;
}
