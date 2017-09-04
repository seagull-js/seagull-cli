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
class SomeOptions extends clime_1.Options {
}
__decorate([
    clime_1.option({ description: 'url path for the api handler', flag: 'p' }),
    __metadata("design:type", String)
], SomeOptions.prototype, "path", void 0);
exports.SomeOptions = SomeOptions;
let default_1 = class default_1 extends clime_1.Command {
    execute(name, options) {
        const pwd = shell.pwd().toString();
        const dest = path_1.join(pwd, 'api', `${name}.ts`);
        const src = path_1.join(__dirname, '..', '..', '..', 'templates', 'api', 'handler.ts');
        shell.mkdir('-p', 'api');
        shell.cp(src, dest);
        shell.sed('-i', 'APINAME', name, dest);
        if (options.path) {
            shell.sed('-i', "// static path = '/'", `static path = '${options.path}'`, dest);
        }
        log(`created api in: ${dest}`);
    }
};
__decorate([
    __param(0, clime_1.param({ description: 'name of the api handler', required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SomeOptions]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({ description: 'scaffold a new api handler' })
], default_1);
exports.default = default_1;
function log(msg) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(msg);
    }
}
//# sourceMappingURL=api.js.map