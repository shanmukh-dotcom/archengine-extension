import { TemplateModule } from '../models/template';

export const PostgresTemplate: TemplateModule = {
  name: 'PostgreSQL',
  dependencies: ['pg'],
  devDependencies: ['@types/pg'],
  files: [
    {
      path: 'src/database/db.ts',
      content: `import { Pool } from 'pg';\n\nexport const pool = new Pool({\n  user: process.env.DB_USER || 'postgres',\n  host: process.env.DB_HOST || 'localhost',\n  database: process.env.DB_NAME || 'my_db',\n  password: process.env.DB_PASSWORD || 'password',\n  port: parseInt(process.env.DB_PORT || '5432'),\n});\n\nexport const query = (text: string, params?: any[]) => pool.query(text, params);`,
      reason: 'PostgreSQL connection pool setup using the pg library.'
    }
  ],
  architectureAdvice: `
### PostgreSQL Database Architecture
- **Design Pattern**: We use connection pooling to manage multiple concurrent database queries without exhausting connection limits.
- **Scalability**: For read-heavy workloads, configure read-replicas. You should also consider adding Redis or Memcached in front of this database for query caching.
- **Security**: Never expose your database directly to the internet. Keep it in a private subnet and only allow connections from your backend servers.
`
};
