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
const integration_test_1 = require("../helper/integration_test");
let LoaderAppTest = class LoaderAppTest extends integration_test_1.default {
    'can build and serve an new empty app'() {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.serve();
            server.close();
        });
    }
    'can build and serve an app with api routes'() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addApi('hello', { path: '/hello' });
            const server = yield this.serve();
            const data = yield fetch('http://localhost:3000/hello');
            const json = yield data.json();
            chai_1.expect(json).to.be.equal('hello world');
            server.close();
        });
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoaderAppTest.prototype, "can build and serve an new empty app", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoaderAppTest.prototype, "can build and serve an app with api routes", null);
LoaderAppTest = __decorate([
    mocha_typescript_1.suite('Quickstart::intro')
], LoaderAppTest);
//# sourceMappingURL=quickstart.js.map