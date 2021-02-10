"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
/**
 * Jovo Host implemented using the nodejs http package https://nodejs.org/api/http.html.
 * this is also compatible with Google's AppEngine.
 */
class HttpHost {
    constructor(req, body, res) {
        this.hasWriteFileAccess = true;
        this.req = req;
        this.res = res;
        this.headers = req.headers;
        try {
            this.$request = JSON.parse(body);
        }
        catch (e) {
            // failed to parse the request body. Send an error back.
            this.fail(e);
        }
    }
    getQueryParams() {
        const queryData = url.parse(this.req.url, true).query;
        return queryData || {};
    }
    getRequestObject() {
        return this.$request;
    }
    setResponse(obj) {
        return new Promise((resolve, reject) => {
            // the promise will get resolved once the callback is called.
            this.res.setHeader('Content-Type', 'application/json; charset=utf8');
            this.res.end(JSON.stringify(obj), resolve);
        });
    }
    // called when an error occurs
    fail(error) {
        if (this.res.headersSent === false) {
            this.res.setHeader('Content-Type', 'application/json; charset=utf8');
            this.res.end(JSON.stringify({
                code: 500,
                msg: error.message,
            }));
        }
    }
}
exports.default = HttpHost;
//# sourceMappingURL=HttpHost.js.map