"use strict";
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
const express = require("express");
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
        server[method](api.module.path.replace('/*', '*').toString(), fn);
    }
    return server;
}
exports.default = wrap;
function mapRequestFormat(req) {
    const method = req.method;
    return new seagull_1.Request(method, req.path, req.params, req.body);
}
//# sourceMappingURL=index.js.map