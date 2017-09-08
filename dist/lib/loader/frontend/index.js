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
const path_1 = require("path");
const streamToString = require("stream-to-string");
const tsify = require("tsify");
function load(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = path_1.join(folder, 'frontend', 'client.tsx');
        const data = yield streamToString(browserify()
            .add(file)
            .plugin(tsify, { noImplicitAny: false })
            .bundle());
        return data;
    });
}
exports.default = load;
//# sourceMappingURL=index.js.map