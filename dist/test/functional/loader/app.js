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
const app_1 = require("../../../lib/loader/app");
const functional_test_1 = require("../../helper/functional_test");
let LoaderAppTest = class LoaderAppTest extends functional_test_1.default {
    'can build a project'() {
        this.addApi('hello', { path: '/hello' });
        this.build();
    }
    'can load demo project with api handlers'() {
        const app = new app_1.default(this.appDir);
        chai_1.expect(app.name).to.be.equal('__tmp__');
        chai_1.expect(app.backend).to.have.length(2);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoaderAppTest.prototype, "can build a project", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoaderAppTest.prototype, "can load demo project with api handlers", null);
LoaderAppTest = __decorate([
    mocha_typescript_1.suite('Loader::app')
], LoaderAppTest);
//# sourceMappingURL=app.js.map