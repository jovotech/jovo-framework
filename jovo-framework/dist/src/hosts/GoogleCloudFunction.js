"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleCloudFunction {
    constructor(req, res) {
        this.hasWriteFileAccess = false;
        // tslint:disable-line
        this.req = req;
        this.res = res;
        this.headers = req.headers;
        this.$request = req.body;
    }
    getQueryParams() {
        return this.req.query || {};
    }
    getRequestObject() {
        return this.$request;
    }
    setResponse(obj) {
        // tslint:disable-line
        return new Promise((resolve) => {
            this.res.json(obj);
            resolve();
        });
    }
    fail(error) {
        if (this.res.headersSent === false) {
            const responseObj = {
                // tslint:disable-line
                code: 500,
                msg: error.message,
            };
            if (process.env.NODE_ENV === 'production') {
                responseObj.stack = error.stack;
            }
            this.res.status(500).json(responseObj);
        }
    }
}
exports.GoogleCloudFunction = GoogleCloudFunction;
//# sourceMappingURL=GoogleCloudFunction.js.map