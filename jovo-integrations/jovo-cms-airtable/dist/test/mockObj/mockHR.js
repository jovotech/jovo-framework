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
                // do nothing
            },
            getQueryParams() {
                return {};
            },
            setResponse() {
                return new Promise((res, rej) => {
                    // do nothing
                });
            },
            fail() {
                // do nothing
            },
        });
    }
}
exports.MockHandleRequest = MockHandleRequest;
//# sourceMappingURL=mockHR.js.map