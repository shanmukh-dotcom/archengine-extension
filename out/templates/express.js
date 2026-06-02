"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressTemplate = void 0;
exports.ExpressTemplate = {
    name: 'Express',
    dependencies: ['express', 'cors', 'dotenv'],
    devDependencies: ['@types/express', '@types/cors', 'typescript', '@types/node', 'ts-node', 'nodemon'],
    files: [
        {
            path: 'src/index.ts',
            content: `import express from 'express';\nimport cors from 'cors';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\nconst PORT = process.env.PORT || 3000;\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on port \${PORT}\`);\n});`,
            reason: 'Main application entry point with standard middleware configuration.'
        },
        {
            path: 'src/routes/index.ts',
            content: `import { Router } from 'express';\n\nconst router = Router();\n\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\nexport default router;`,
            reason: 'Central router configuration with a default health check endpoint.'
        },
        {
            path: '.env.example',
            content: `PORT=3000\nNODE_ENV=development`,
            reason: 'Environment variable template.'
        },
        {
            path: 'tsconfig.json',
            content: `{\n  "compilerOptions": {\n    "target": "es2022",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true,\n    "forceConsistentCasingInFileNames": true\n  }\n}`,
            reason: 'Standard TypeScript configuration for Node.js backends.'
        }
    ],
    architectureAdvice: `
### Express Backend Architecture
- **Design Pattern**: We use an MVC-like routing structure. The \`src/routes\` folder handles URL routing. In a scaled application, you should create a \`src/controllers\` folder to handle business logic separately from the routes.
- **Scalability**: Express is single-threaded. To scale to 1M users, use PM2 cluster mode or deploy via Docker containers orchestrated by Kubernetes/ECS. Keep the server stateless.
- **Security**: Ensure you add the \`helmet\` package in production for secure HTTP headers. Rate limiting should be implemented at the API Gateway or using \`express-rate-limit\`.
`
};
//# sourceMappingURL=express.js.map