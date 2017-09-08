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
    'does generate a new project'() {
        chai_1.expect(fs_1.existsSync(this.appDir)).to.be.equal(true);
    }
    'project contains README file'() {
        const file = path_1.join(this.appDir, 'README.md');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
    }
    'project contains package.json file'() {
        const file = path_1.join(this.appDir, 'package.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const text = fs_1.readFileSync(file, { encoding: 'utf-8' });
        chai_1.expect(text).to.include(this.appName);
        const json = JSON.parse(text);
        chai_1.expect(json.name).to.be.equal(this.appName);
        chai_1.expect(json.version).to.be.equal('0.1.0');
    }
    'project contains tsconfig file'() {
        const file = path_1.join(this.appDir, 'tsconfig.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const json = JSON.parse(fs_1.readFileSync(file, { encoding: 'utf-8' }));
        chai_1.expect(json).to.be.an('object');
    }
    'project contains tslint file'() {
        const file = path_1.join(this.appDir, 'tslint.json');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
        const json = JSON.parse(fs_1.readFileSync(file, { encoding: 'utf-8' }));
        chai_1.expect(json).to.be.an('object');
    }
    'project contains api folder'() {
        const file = path_1.join(this.appDir, 'api');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project api folder contains Frontend.ts file'() {
        const file = path_1.join(this.appDir, 'api', 'Frontend.ts');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project contains frontend folder'() {
        const file = path_1.join(this.appDir, 'frontend');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project frontend folder contains layout.tsx file'() {
        const file = path_1.join(this.appDir, 'frontend', 'layout.tsx');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project frontend folder contains routes.tsx file'() {
        const file = path_1.join(this.appDir, 'frontend', 'routes.tsx');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project frontend folder contains pages folder'() {
        const file = path_1.join(this.appDir, 'frontend', 'pages');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
    'project frontend pages folder contains hello.tsx file'() {
        const file = path_1.join(this.appDir, 'frontend', 'pages', 'hello.tsx');
        chai_1.expect(fs_1.existsSync(file)).to.be.equal(true);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "does generate a new project", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains README file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains package.json file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains tsconfig file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains tslint file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains api folder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project api folder contains Frontend.ts file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project contains frontend folder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project frontend folder contains layout.tsx file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project frontend folder contains routes.tsx file", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project frontend folder contains pages folder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewCommandTest.prototype, "project frontend pages folder contains hello.tsx file", null);
NewCommandTest = __decorate([
    mocha_typescript_1.suite('Commands::new')
], NewCommandTest);
//# sourceMappingURL=new.js.map