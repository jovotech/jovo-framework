"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
__export(require("axios"));
class HttpService {
    // tslint:disable-next-line:no-any
    static request(config) {
        return axios_1.default.request(config);
    }
    // tslint:disable-next-line:no-any
    static get(url, config) {
        return axios_1.default.get(url, config);
    }
    // tslint:disable-next-line:no-any
    static delete(url, config) {
        return axios_1.default.delete(url, config);
    }
    // tslint:disable-next-line:no-any
    static head(url, config) {
        return axios_1.default.head(url, config);
    }
    // tslint:disable-next-line:no-any
    static post(url, 
    // tslint:disable-next-line:no-any
    data, config) {
        return axios_1.default.post(url, data, config);
    }
    // tslint:disable-next-line:no-any
    static put(url, 
    // tslint:disable-next-line:no-any
    data, config) {
        return axios_1.default.put(url, data, config);
    }
    // tslint:disable-next-line:no-any
    static patch(url, 
    // tslint:disable-next-line:no-any
    data, config) {
        return axios_1.default.patch(url, data, config);
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=HttpService.js.map