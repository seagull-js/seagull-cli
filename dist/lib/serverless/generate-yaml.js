"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
function generate(app) {
    const sls = new builder_1.default(app.name);
    for (const api of app.backend) {
        const { method, path } = api.module;
        const event = { http: `${method} ${path}` };
        const fn = { handler: api.handler, timeout: 30, events: [event] };
        sls.addFunction(api.name, fn);
    }
    return sls.toYAML();
}
exports.default = generate;
//# sourceMappingURL=generate-yaml.js.map