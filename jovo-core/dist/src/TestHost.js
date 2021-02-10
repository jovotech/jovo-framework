"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("./util/Log");
class TestHost {
    constructor(req) {
        this.hasWriteFileAccess = true; // tests shouldn't write to filesystem
        this.failed = false;
        // tslint:disable-line:no-any
        this.headers = { 'jovo-test': 'TestHost' };
        this.req = req;
        this.$request = req;
    }
    /**
     * Full request object
     * @returns {any}
     */
    getRequestObject() {
        // tslint:disable-line:no-any
        return this.$request;
    }
    /**
     * Save the response
     * @param obj
     * @returns {Promise<any>}
     */
    setResponse(obj) {
        // tslint:disable-line:no-any
        return new Promise((resolve) => {
            this.res = obj;
            resolve();
        });
    }
    getQueryParams() {
        return this.res.query || {};
    }
    /**
     * Return the previously set response object
     */
    getResponse() {
        // tslint:disable-line:no-any
        return this.res;
    }
    /**
     * Save the error and set failed flag
     * @param error
     */
    fail(error) {
        Log_1.Log.error('TestHost.fail: ');
        Log_1.Log.error(error);
        this.err = error;
        this.failed = true;
    }
    /**
     * Return the previously set error
     * @returns Error
     */
    getError() {
        return this.err;
    }
    /**
     * Returns true if an error occurred while handling the request
     */
    didFail() {
        return this.failed;
    }
}
exports.TestHost = TestHost;
//# sourceMappingURL=TestHost.js.map