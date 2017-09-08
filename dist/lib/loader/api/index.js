"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const dir = require("node-dir");
const api_handler_1 = require("./api_handler");
exports.ApiHandler = api_handler_1.default;
function loader(appName, folder) {
    if (!fs_1.existsSync(folder)) {
        return [];
    }
    const handlers = dir
        .files(folder, { sync: true })
        .filter(file => /\.ts$/.test(file))
        .map(file => new api_handler_1.default(appName, file));
    return sorted(handlers);
}
exports.default = loader;
function sorted(apis) {
    const regular = lodash_1.filter(apis, api => api.module.path !== '/*');
    const greedy = lodash_1.filter(apis, api => api.module.path === '/*');
    return lodash_1.union(regular, greedy);
}
//# sourceMappingURL=index.js.map