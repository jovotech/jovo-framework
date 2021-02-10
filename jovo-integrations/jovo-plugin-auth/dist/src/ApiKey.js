"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
class ApiKey {
    constructor(config) {
        this.config = {};
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(parent) {
        parent.middleware('before.request').use(this.beforerequest.bind(this));
    }
    async beforerequest(handleRequest) {
        const key = this.config.customKeyName || 'x-api-key';
        const value = this.config.customKeyValue || this.config['x-api-key'];
        if (this.config[key]) {
            if (!handleRequest.host.headers[key] && !handleRequest.host.getQueryParams()[key]) {
                throw new Error('Not authorized.');
            }
            if (handleRequest.host.headers[key] && handleRequest.host.headers[key] !== value) {
                throw new Error('Not authorized.');
            }
            if (handleRequest.host.getQueryParams()[key] &&
                handleRequest.host.getQueryParams()[key] !== value) {
                throw new Error('Not authorized.');
            }
        }
    }
}
exports.ApiKey = ApiKey;
//# sourceMappingURL=ApiKey.js.map