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
const browserify = require("browserify");
const fs_1 = require("fs");
const dir = require("node-dir");
const path_1 = require("path");
const shell = require("shelljs");
const streamToString = require("stream-to-string");
const UglifyJS = require("uglify-es");
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
function bundle() {
    return __awaiter(this, void 0, void 0, function* () {
        const src = path_1.join(process.cwd(), '.seagull', 'dist', 'frontend', 'client.js');
        const data = yield streamToString(browserify()
            .add(src)
            .bundle());
        const blob = UglifyJS.minify(data);
        const dist = path_1.join(process.cwd(), '.seagull', 'assets', 'bundle.js');
        fs_1.writeFileSync(dist, blob, { encoding: 'utf-8' });
    });
}
exports.bundle = bundle;
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