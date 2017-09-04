"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            .split('/.seagull/dist/')
            .reverse()[0]
            .replace(/\//g, '-')
            .replace(/\.js$/, '');
        this.name = `${this.appName}-${id}`;
    }
    generateHandler() {
        this.handler = this.filePath
            .split('/.seagull/')
            .reverse()[0]
            .replace(/\.js$/, '.handler');
    }
    loadModule() {
        delete require.cache[this.filePath];
        this.module = require(this.filePath).default;
    }
}
exports.default = ApiHandler;
//# sourceMappingURL=api_handler.js.map