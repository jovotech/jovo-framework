import { BaseApp, Host } from 'jovo-core';

export class MockHandleRequest {
    app = new BaseApp();
    host: Host = {
        $request: {},
        hasWriteFileAccess: true,
        headers: {},
        getRequestObject() {
            // do nothing

        },
        setResponse() {
            return new Promise((res, rej) => {
                // do nothing
            });
        },
        fail() {
            // do nothing
        }
    };
}
