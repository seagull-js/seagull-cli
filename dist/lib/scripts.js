"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dir = require("node-dir");
const path_1 = require("path");
const shell = require("shelljs");
function binPath(name) {
    return path_1.join(__dirname, '..', '..', 'node_modules', '.bin', name);
}
function lint() {
    shell.exec(`${binPath('tslint')} -c tslint.json --fix src/**/*.ts`);
}
exports.lint = lint;
function prettier() {
    const args = '--single-quote --no-semi --trailing-comma es5';
    const cmd = `${binPath('prettier')} ${args} --write src/**/*.ts`;
    shell.exec(cmd, { silent: true });
}
exports.prettier = prettier;
function tsc() {
    shell.rm('-rf', '.seagull/dist');
    shell.exec(`${binPath('tsc')}`);
}
exports.tsc = tsc;
function browserify() {
    shell.exec(`${binPath('browserify')} .seagull/dist/frontend/client.js > .seagull/assets/bundle.js`);
}
exports.browserify = browserify;
function modifyScriptExports() {
    const files = dir
        .files('.seagull/dist/api', { sync: true })
        .filter(file => /\.js$/.test(file));
    const from = /exports\.default = (\w+);/;
    const to = 'exports.default = $1;\nexports.handler = $1.dispatch.bind($1);';
    shell.sed('-i', from, to, files);
}
exports.modifyScriptExports = modifyScriptExports;
//# sourceMappingURL=scripts.js.map