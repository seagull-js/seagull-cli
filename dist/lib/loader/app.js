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
const path_1 = require("path");
const api_1 = require("./api");
const _1 = require("./frontend/");
var api_2 = require("./api");
exports.ApiHandler = api_2.ApiHandler;
class App {
    constructor(folder) {
        this.folder = folder;
        this.backend = [];
        this.name = '';
        this.loadPackageJson();
        this.loadApiHandlers();
    }
    loadFrontendBundle() {
        return __awaiter(this, void 0, void 0, function* () {
            this.frontend = yield _1.default(this.folder);
        });
    }
    loadPackageJson() {
        const file = path_1.join(this.folder, 'package.json');
        this.package = require(file);
        this.name = this.package.name;
    }
    loadApiHandlers() {
        const folder = path_1.join(this.folder, 'api');
        this.backend = api_1.default(this.name, folder);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map