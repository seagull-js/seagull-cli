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
const api_handler_1 = require("../../../lib/loader/api/api_handler");
let ApiHandlerTest = class ApiHandlerTest {
    'can load an API handler directly from file'() {
        const file = path_1.join(__dirname, 'example', 'Hello.js');
        const handler = new api_handler_1.default('myapp', file);
        chai_1.expect(handler.appName).to.be.equal('myapp');
        chai_1.expect(handler.filePath).to.be.equal(file);
        chai_1.expect(handler.name).to.include('example-Hello');
        chai_1.expect(handler.module).to.be.a('function');
        chai_1.expect(handler.module.path).to.be.equal('/hello');
        chai_1.expect(handler.module.method).to.be.equal('GET');
        chai_1.expect(handler.handler).to.include('Hello.handler');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiHandlerTest.prototype, "can load an API handler directly from file", null);
ApiHandlerTest = __decorate([
    mocha_typescript_1.suite()
], ApiHandlerTest);
//# sourceMappingURL=api_handler.js.map