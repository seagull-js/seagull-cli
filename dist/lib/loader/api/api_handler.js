"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsnode = require("ts-node");
tsnode.register({ fast: true });
class ApiHandler {
    constructor(appName, filePath) {
        this.appName = appName;
        this.filePath = filePath;
        this.generateName();
        this.generateHandler();
        this.loadModule();
    }
    generateName() {
        const id = this.filePath
            .split('/api/')
            .reverse()[0]
            .replace(/\//g, '-')
            .replace(/\.ts$/, '');
        this.name = `api-${id}`;
    }
    generateHandler() {
        const id = this.filePath
            .split('/api/')
            .reverse()[0]
            .replace(/\.ts$/, '.handler');
        this.handler = `dist/api/${id}`;
    }
    loadModule() {
        delete require.cache[this.filePath];
        this.module = require(this.filePath).default;
    }
}
exports.default = ApiHandler;
//# sourceMappingURL=api_handler.js.map