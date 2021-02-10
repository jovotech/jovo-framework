"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
class Bearer {
    constructor(config) {
        this.config = {
            bearer: '',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(parent) {
        parent.middleware('before.request').use(this.beforerequest.bind(this));
    }
    async beforerequest(handleRequest) {
        const token = handleRequest.host.headers['Authorization'] ||
            handleRequest.host.headers['authorization'] ||
            '';
        const headerValue = `Bearer ${this.config.bearer}`;
        if (headerValue !== token) {
            throw new Error('Not authorized.');
        }
    }
}
exports.Bearer = Bearer;
//# sourceMappingURL=Bearer.js.map