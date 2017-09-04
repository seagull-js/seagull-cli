"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YAML = require("yamljs");
class Builder {
    constructor(name) {
        this.data = this.createDefaultServerless();
        this.data.service = name;
    }
    addIAMRoleStatement(item) {
        this.data.provider.iamRoleStatements.push(item);
        return this;
    }
    addPlugin(item) {
        this.data.plugins.push(item);
        return this;
    }
    addFunction(name, fn) {
        this.data.functions[name] = fn;
        return this;
    }
    toYAML() {
        return YAML.stringify(this.data, 4);
    }
    createDefaultServerless() {
        return {
            frameworkVersion: '=1.19.0',
            functions: {},
            plugins: [],
            provider: this.createDefaultProvider(),
            service: '',
        };
    }
    createDefaultProvider() {
        return {
            iamRoleStatements: [],
            name: 'aws',
            region: 'eu-central-1',
            runtime: 'nodejs6.10',
            stage: 'dev',
            timeout: 30,
        };
    }
}
exports.default = Builder;
//# sourceMappingURL=builder.js.map