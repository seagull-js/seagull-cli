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
const clime_1 = require("clime");
const fs_1 = require("fs");
const path_1 = require("path");
const shell = require("shelljs");
const app_1 = require("../lib/loader/app");
const scripts_1 = require("../lib/scripts");
const generate_yaml_1 = require("../lib/serverless/generate-yaml");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        initFolder();
        compileScripts();
        createServerlessYaml();
        scripts_1.browserify();
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({ description: 'compile a seagull app into a deployable bundle' })
], default_1);
exports.default = default_1;
function initFolder() {
    shell.mkdir('-p', '.seagull');
    shell.cp('package.json', '.seagull/package.json');
    if (fs_1.existsSync(path_1.join(shell.pwd().toString(), 'node_modules'))) {
        shell.cp('-R', 'node_modules', '.seagull/node_modules');
    }
    shell.mkdir('-p', '.seagull/assets');
}
function compileScripts() {
    if (fs_1.existsSync(path_1.join(shell.pwd().toString(), 'api'))) {
        if (process.env.NODE_ENV !== 'test') {
            scripts_1.lint();
            scripts_1.prettier();
        }
        scripts_1.tsc();
        scripts_1.modifyScriptExports();
    }
}
function createServerlessYaml() {
    const pwd = shell.pwd().toString();
    const app = new app_1.default(path_1.join(pwd, '.seagull'));
    const yml = generate_yaml_1.default(app);
    const ymlPath = path_1.join(pwd, '.seagull', 'serverless.yml');
    fs_1.writeFileSync(ymlPath, yml);
}
//# sourceMappingURL=build.js.map