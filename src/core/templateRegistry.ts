import { TemplateModule } from '../models/template';
import { ExpressTemplate } from '../templates/express';
import { NextjsTemplate } from '../templates/nextjs';
import { PostgresTemplate } from '../templates/postgres';
import { MongoTemplate } from '../templates/mongodb';

export class TemplateRegistry {
  
  public static getFramework(name: string): TemplateModule | null {
    const lower = name.toLowerCase();
    if (lower.includes('express')) return ExpressTemplate;
    if (lower.includes('next.js') || lower.includes('nextjs')) return NextjsTemplate;
    return null;
  }

  public static getDatabase(name: string): TemplateModule | null {
    const lower = name.toLowerCase();
    if (lower.includes('postgres')) return PostgresTemplate;
    if (lower.includes('mongo')) return MongoTemplate;
    return null;
  }

  // Future expansion: getFeature(name) for Auth, Payments, etc.
}
