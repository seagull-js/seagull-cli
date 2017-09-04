"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const shell = require("shelljs");
const base_test_1 = require("./base_test");
let FunctionalTest = class FunctionalTest extends base_test_1.default {
    static before() {
        this.create(this.appName);
        shell.cd(this.appName);
    }
    static after() {
        shell.cd(this.cwd);
        shell.rm('-rf', this.appName);
    }
};
FunctionalTest = __decorate([
    mocha_typescript_1.suite
], FunctionalTest);
exports.default = FunctionalTest;
//# sourceMappingURL=functional_test.js.map