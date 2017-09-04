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
const fs_1 = require("fs");
const mocha_typescript_1 = require("mocha-typescript");
const path_1 = require("path");
const functional_test_1 = require("../../helper/functional_test");
let NewCommandTest = class NewCommandTest extends functional_test_1.default {
    canGenerateNewProject() {
        chai_1.expect(fs_1.existsSync(this.appDir)).to.be.equal(true);
    }
    containsReadMe() {
        const file = path_1.join(this.appDir, 'README.md');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
    }
    containsPackageJson() {
        const file = path_1.join(this.appDir, 'package.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
        const json = JSON.parse(text);
        chai_1.expect(json.name).to.be.equal(this.appName);
        chai_1.expect(json.version).to.be.equal('0.1.0');
    }
    containsTsconfig() {
        const file = path_1.join(this.appDir, 'tsconfig.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const json = JSON.parse(fs_1.readFileSync(file, { encoding: 'utf-8' }));
        chai_1.expect(json).to.be.an('object');
    }
    containsTslint() {
        const file = path_1.join(this.appDir, 'tslint.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const json = JSON.parse(fs_1.readFileSync(file, { encoding: 'utf-8' }));
        chai_1.expect(json).to.be.an('object');
    }
};
__decorate([
    mocha_typescript_1.test('does generate a new project'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "canGenerateNewProject", null);
__decorate([
    mocha_typescript_1.test('project contains README file'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "containsReadMe", null);
__decorate([
    mocha_typescript_1.test('project contains package.json file'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "containsPackageJson", null);
__decorate([
    mocha_typescript_1.test('project contains tsconfig file'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "containsTsconfig", null);
__decorate([
    mocha_typescript_1.test('project contains tslint file'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "containsTslint", null);
NewCommandTest = __decorate([
    mocha_typescript_1.suite('Commands::new')
], NewCommandTest);
//# sourceMappingURL=new.js.map