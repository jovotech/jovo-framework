"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class MockHandleRequest extends jovo_core_1.HandleRequest {
    constructor() {
        super(new jovo_core_1.BaseApp(), {
            $request: {},
            hasWriteFileAccess: true,
            headers: {},
            getRequestObject() {
                // tslint:disable-line:no-empty
            },
            getQueryParams() {
                return {};
            },
            setResponse() {
                return new Promise((res, rej) => {
                    // tslint:disable-line:no-empty
                });
            },
            fail() {
                // tslint:disable-line:no-empty
            },
        });
    }
}
exports.MockHandleRequest = MockHandleRequest;
//# sourceMappingURL=mockHR.js.map