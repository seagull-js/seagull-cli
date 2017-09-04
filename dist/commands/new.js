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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const clime_1 = require("clime");
const path_1 = require("path");
const shell = require("shelljs");
let default_1 = class default_1 extends clime_1.Command {
    execute(name) {
        log('scaffolding new seagull app...');
        const dest = copyTemplateFolder(name);
        if (process.env.NODE_ENV === 'test') {
            log('skipping dependencies...');
        }
        else {
            log('installing dependencies...');
            setupDependencies(dest);
        }
        log(`created app in: ${dest}`);
    }
};
__decorate([
    __param(0, clime_1.param({ description: 'name of the app', required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({ description: 'create a new seagull app' })
], default_1);
exports.default = default_1;
function log(msg) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(msg);
    }
}
function copyTemplateFolder(name) {
    const pwd = shell.pwd();
    const dest = `${pwd}/${name}`;
    const src = path_1.join(__dirname, '..', '..', 'templates', 'app');
    shell.cp('-R', src, dest);
    shell.sed('-i', 'APP_NAME', name, path_1.join(dest, 'package.json'));
    shell.sed('-i', 'APP_NAME', name, path_1.join(dest, 'README.md'));
    return dest;
}
function setupDependencies(dest) {
    shell.cd(dest);
    shell.exec('npm install', { silent: true });
}
//# sourceMappingURL=new.js.map