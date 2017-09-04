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
const seagull_1 = require("@seagull-js/seagull");
const clime_1 = require("clime");
const express = require("express");
const path_1 = require("path");
const shell = require("shelljs");
const app_1 = require("../lib/loader/app");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        log('> starting dev server with live reload (TODO: reload)...');
        const path = path_1.join(shell.pwd().toString(), '.seagull');
        const app = new app_1.default(path);
        const server = wrap(app);
        if (process.env.NODE_ENV === 'test') {
            return server.listen(3000, () => log('server ready on localhost:3000'));
        }
        else {
            server.listen(3000, () => log('server ready on localhost:3000'));
        }
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({ description: 'start local devserver for your app' })
], default_1);
exports.default = default_1;
function log(msg) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(msg);
    }
}
function wrap(app) {
    const server = express();
    for (const api of app.backend) {
        const fn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = mapRequestFormat(req);
            const handler = new api.module();
            const response = yield handler.handle(request);
            res.json(response.body);
        });
        const method = api.module.method.toString().toLowerCase();
        server[method](api.module.path.toString(), fn);
    }
    return server;
}
function mapRequestFormat(req) {
    const method = req.method;
    return new seagull_1.Request(method, req.path, req.params, req.body);
}
//# sourceMappingURL=serve.js.map