"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRegistry = void 0;
const express_1 = require("../templates/express");
const nextjs_1 = require("../templates/nextjs");
const postgres_1 = require("../templates/postgres");
const mongodb_1 = require("../templates/mongodb");
class TemplateRegistry {
    static getFramework(name) {
        const lower = name.toLowerCase();
        if (lower.includes('express'))
            return express_1.ExpressTemplate;
        if (lower.includes('next.js') || lower.includes('nextjs'))
            return nextjs_1.NextjsTemplate;
        return null;
    }
    static getDatabase(name) {
        const lower = name.toLowerCase();
        if (lower.includes('postgres'))
            return postgres_1.PostgresTemplate;
        if (lower.includes('mongo'))
            return mongodb_1.MongoTemplate;
        return null;
    }
}
exports.TemplateRegistry = TemplateRegistry;
//# sourceMappingURL=templateRegistry.js.map