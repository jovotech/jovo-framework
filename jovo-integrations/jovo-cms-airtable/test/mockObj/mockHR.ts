import { BaseApp, Host } from 'jovo-core';

export class MockHandleRequest {
    app = new BaseApp();
    host: Host = {
        hasWriteFileAccess: true,
        headers: {},
        $request: {},
        getRequestObject() {},
        setResponse() {
            return new Promise((res, rej) => {});
        },
        fail() {}
    };
}