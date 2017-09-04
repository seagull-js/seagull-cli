"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
const path_1 = require("path");
const YAML = require("yamljs");
const app_1 = require("../../../lib/loader/app");
const generate_yaml_1 = require("../../../lib/serverless/generate-yaml");
const functional_test_1 = require("../../helper/functional_test");
let ServeCommandTest = class ServeCommandTest extends functional_test_1.default {
    'can build a project'() {
        this.addApi('Hello', '/hello');
        this.build();
    }
    'can generate a serverless.yml in memory'() {
        const app = new app_1.default(path_1.join(this.appDir, '.seagull'));
        const yml = YAML.parse(generate_yaml_1.default(app));
        chai_1.expect(yml.provider.name).to.be.equal('aws');
        chai_1.expect(yml.provider.runtime).to.be.equal('nodejs6.10');
        chai_1.expect(yml.provider.region).to.be.equal('eu-central-1');
        chai_1.expect(yml.provider.timeout).to.be.equal(30);
    }
    'yaml contains functions'() {
        const app = new app_1.default(path_1.join(this.appDir, '.seagull'));
        const yml = YAML.parse(generate_yaml_1.default(app));
        chai_1.expect(yml.functions).to.be.an('object');
        chai_1.expect(yml.functions).to.have.key('__tmp__-api-Hello');
    }
    'yaml functions have correct data fields'() {
        const app = new app_1.default(path_1.join(this.appDir, '.seagull'));
        const yml = YAML.parse(generate_yaml_1.default(app));
        const fn = yml.functions['__tmp__-api-Hello'];
        chai_1.expect(fn.timeout).to.be.equal(30);
        chai_1.expect(fn.events).to.be.an('array');
        chai_1.expect(fn.handler).to.be.equal('dist/api/Hello.handler');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServeCommandTest.prototype, "can build a project", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServeCommandTest.prototype, "can generate a serverless.yml in memory", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServeCommandTest.prototype, "yaml contains functions", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServeCommandTest.prototype, "yaml functions have correct data fields", null);
ServeCommandTest = __decorate([
    mocha_typescript_1.suite('Serverless::generate_yaml')
], ServeCommandTest);
//# sourceMappingURL=generate-yaml.js.map