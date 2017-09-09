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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs_1 = require("fs");
const mocha_typescript_1 = require("mocha-typescript");
const path_1 = require("path");
const functional_test_1 = require("../../helper/functional_test");
let BuildCommandTest = class BuildCommandTest extends functional_test_1.default {
    'can build a project'() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addApi('hello', { path: '/' });
            this.addPage('example');
            yield this.build();
        });
    }
    'creates hidden subfolder in project'() {
        const folder = path_1.join(this.appDir, '.seagull');
        chai_1.expect(fs_1.existsSync(folder)).to.be.equal(true);
    }
    'creates serverless.yml in subfolder'() {
        const file = path_1.join(this.appDir, '.seagull', 'serverless.yml');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
    }
    'subfolder contains package.json file'() {
        const file = path_1.join(this.appDir, '.seagull', 'package.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
        const json = JSON.parse(text);
        chai_1.expect(json.name).to.be.equal(this.appName);
        chai_1.expect(json.version).to.be.equal('0.1.0');
    }
    'subfolder contains dist folder'() {
        const folder = path_1.join(this.appDir, '.seagull', 'dist');
        chai_1.expect(fs_1.existsSync(folder)).to.be.equal(true);
    }
    'api handler exports get rewritten'() {
        const file = path_1.join(this.appDir, '.seagull', 'dist', 'api', 'hello.js');
        const api = require(file);
        chai_1.expect(api.default).to.be.a('function');
        chai_1.expect(api.handler).to.be.a('function');
    }
    'frontend folders get added and compiled'() {
        const file = path_1.join(this.appDir, '.seagull', 'dist', 'frontend', 'pages', 'example.js');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include('example');
    }
    'frontend gets browserified into a single file'() {
        const file = path_1.join(this.appDir, '.seagull', 'assets', 'bundle.js');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
};
__decorate([
    mocha_typescript_1.timeout(20000),
    mocha_typescript_1.slow(5000),
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuildCommandTest.prototype, "can build a project", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "creates hidden subfolder in project", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "creates serverless.yml in subfolder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "subfolder contains package.json file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "subfolder contains dist folder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "api handler exports get rewritten", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "frontend folders get added and compiled", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildCommandTest.prototype, "frontend gets browserified into a single file", null);
BuildCommandTest = __decorate([
    mocha_typescript_1.suite('Commands::build')
], BuildCommandTest);
//# sourceMappingURL=build.js.map