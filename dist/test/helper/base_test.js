"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const shell = require("shelljs");
const api_1 = require("../../commands/add/api");
const build_1 = require("../../commands/build");
const new_1 = require("../../commands/new");
const serve_1 = require("../../commands/serve");
const cwd = shell.pwd().toString();
const appName = '__tmp__';
const appDir = path_1.join(cwd, appName);
class BaseTest {
    constructor() {
        this.cwd = cwd;
        this.appName = appName;
        this.appDir = appDir;
        this.addApi = new api_1.default().execute;
        this.build = new build_1.default().execute;
        this.create = new new_1.default().execute;
        this.serve = new serve_1.default().execute;
    }
}
BaseTest.cwd = cwd;
BaseTest.appName = appName;
BaseTest.appDir = appDir;
BaseTest.addApi = new api_1.default().execute;
BaseTest.build = new build_1.default().execute;
BaseTest.create = new new_1.default().execute;
BaseTest.serve = new serve_1.default().execute;
exports.default = BaseTest;
//# sourceMappingURL=base_test.js.map