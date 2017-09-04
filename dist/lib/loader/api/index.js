"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const dir = require("node-dir");
const api_handler_1 = require("./api_handler");
exports.ApiHandler = api_handler_1.default;
function loader(appName, folder) {
    if (!fs_1.existsSync(folder)) {
        return [];
    }
    return dir
        .files(folder, { sync: true })
        .filter(file => /\.js$/.test(file))
        .map(file => new api_handler_1.default(appName, file));
}
exports.default = loader;
//# sourceMappingURL=index.js.map