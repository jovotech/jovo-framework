"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
class PlatformStorage {
    constructor(config) {
        this.needsWriteFileAccess = false;
        this.config = {};
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        app.$db = this;
    }
    // tslint:disable-next-line:no-any
    async load(primaryKey, jovo) {
        if (!jovo) {
            return;
        }
        // tslint:disable-next-line:no-any
        const request = jovo.$request;
        const userData = request.context && request.context.user
            ? Object.assign({ data: {} }, request.context.user) : { data: {} };
        return { userData };
    }
    async save(primaryKey, key, data, // tslint:disable-line:no-any
    updatedAt, jovo) {
        if (!jovo) {
            return;
        }
        // tslint:disable-next-line:no-any
        jovo.$response.user = Object.assign({}, data);
        return;
    }
    async delete(primaryKey, jovo) {
        if (!jovo) {
            return;
        }
        // tslint:disable-next-line:no-any
        jovo.$response.user = {
            data: {},
        };
        return;
    }
}
exports.PlatformStorage = PlatformStorage;
//# sourceMappingURL=PlatformStorage.js.map