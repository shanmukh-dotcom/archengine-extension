"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTemplate = void 0;
exports.MongoTemplate = {
    name: 'MongoDB',
    dependencies: ['mongoose'],
    devDependencies: ['@types/mongoose'],
    files: [
        {
            path: 'src/database/db.ts',
            content: `import mongoose from 'mongoose';\n\nexport const connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/my_db');\n    console.log(\`MongoDB Connected: \${conn.connection.host}\`);\n  } catch (error: any) {\n    console.error(\`Error: \${error.message}\`);\n    process.exit(1);\n  }\n};`,
            reason: 'MongoDB connection setup using Mongoose.'
        }
    ],
    architectureAdvice: `
### MongoDB Database Architecture
- **Design Pattern**: We use Mongoose for ODM (Object Data Modeling) to provide schema validation and relationships in a schema-less database.
- **Scalability**: MongoDB scales horizontally very well. For high availability, use a Replica Set. For massive datasets, implement Sharding.
- **Security**: Ensure your MongoDB instance has authentication enabled and uses Role-Based Access Control (RBAC). Do not run without a password.
`
};
//# sourceMappingURL=mongodb.js.map