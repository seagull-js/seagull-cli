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
const mocha_typescript_1 = require("mocha-typescript");
const fetch = require("node-fetch");
const functional_test_1 = require("../../helper/functional_test");
let ServeCommandTest = class ServeCommandTest extends functional_test_1.default {
    'can build a project'() {
        this.addApi('hello', { path: '/hello' });
    }
    'does load an app and starts the dev server'() {
        return __awaiter(this, void 0, void 0, function* () {
            const server = this.serve();
            const data = yield fetch('http://localhost:3000/hello');
            const json = yield data.json();
            chai_1.expect(json).to.be.equal('hello world');
            server.close();
        });
    }
    'does render html pages (SSR)'() {
        return __awaiter(this, void 0, void 0, function* () {
            const server = this.serve();
            const data = yield fetch('http://localhost:3000/');
            const html = yield data.text();
            chai_1.expect(html).to.include(`<title>${this.appName}</title>`);
            server.close();
        });
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
    __metadata("design:returntype", Promise)
], ServeCommandTest.prototype, "does load an app and starts the dev server", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServeCommandTest.prototype, "does render html pages (SSR)", null);
ServeCommandTest = __decorate([
    mocha_typescript_1.suite('Commands::serve')
], ServeCommandTest);
//# sourceMappingURL=serve.js.map