"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const api_1 = require("./api");
class App {
    constructor(folder) {
        this.folder = folder;
        this.backend = [];
        this.name = '';
        this.loadPackageJson();
        this.loadApiHandlers();
    }
    loadPackageJson() {
        const file = path_1.join(this.folder, 'package.json');
        this.package = require(file);
        this.name = this.package.name;
    }
    loadApiHandlers() {
        const folder = path_1.join(this.folder, 'dist', 'api');
        this.backend = api_1.default(this.name, folder);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map