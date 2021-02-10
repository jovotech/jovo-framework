"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
    // tslint:disable-next-line:no-string-literal
    if (jovo_core_1.Log.config.appenders['console']) {
        jovo_core_1.Log.config.appenders['console'].ignoreFormatting = true; // tslint:disable-line:no-string-literal
    }
}
class Lambda {
    // tslint:disable-next-line:no-any
    constructor(event, context, callback) {
        this.isApiGateway = false;
        this.responseHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        this.hasWriteFileAccess = false;
        this.event = event;
        this.context = context;
        this.callback = callback;
        if (typeof event.body !== 'undefined') {
            this.isApiGateway = true;
            this.headers = event.headers;
            this.$request = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        }
        else {
            this.$request = event;
        }
    }
    getQueryParams() {
        return this.event.queryStringParameters || {};
    }
    getRequestObject() {
        return this.$request;
    }
    setResponse(obj) {
        // tslint:disable-line
        return new Promise((resolve) => {
            if (this.isApiGateway) {
                this.callback(null, {
                    body: typeof obj === 'object' ? JSON.stringify(obj) : obj,
                    headers: this.responseHeaders,
                    isBase64Encoded: false,
                    statusCode: 200,
                });
            }
            else {
                this.callback(null, obj);
            }
            resolve();
        });
    }
    fail(error) {
        const responseObj = {
            // tslint:disable-line
            code: 500,
            msg: error.message,
        };
        if (process.env.NODE_ENV === 'production') {
            responseObj.stack = error.stack;
        }
        if (this.isApiGateway) {
            this.callback(error, {
                body: JSON.stringify(responseObj),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                isBase64Encoded: false,
                statusCode: 500,
            });
        }
        else {
            this.callback(error, responseObj);
        }
    }
}
exports.Lambda = Lambda;
//# sourceMappingURL=Lambda.js.map