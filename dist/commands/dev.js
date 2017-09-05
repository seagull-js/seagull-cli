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
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        log('> starting dev server with live reload...');
        const nodemon = require('nodemon');
        nodemon({
            exec: 'seagull serve',
            ext: 'json,ts',
            watch: ['api', 'package.json'],
        });
        nodemon.on('restart', files => {
            log('App restarted due to: ', files);
        });
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: 'start local dev server for your app with live reload',
    })
], default_1);
exports.default = default_1;
function log(...args) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...args);
    }
}
//# sourceMappingURL=dev.js.map