import {Host, Log} from "jovo-core";

if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
    if (Log.config.appenders['console']) {
        Log.config.appenders['console'].ignoreFormatting = true;
    }
}

export class Lambda implements Host {
    headers: any; // tslint:disable-line
    event: any; // tslint:disable-line
    context: any; // tslint:disable-line
    callback: any; // tslint:disable-line
    isApiGateway = false;
    $request: any; // tslint:disable-line

    hasWriteFileAccess = false;

    constructor(event: any, context: any, callback: Function) { // tslint:disable-line
        this.event = event;
        this.context = context;
        this.callback = callback;
        if (event.body) {
            this.isApiGateway = true;
            this.$request = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body;
        } else {
            this.$request = event;
        }
    }
    getRequestObject() {
        return this.$request;
    }
    setResponse(obj: any) { // tslint:disable-line
        return new Promise<void>((resolve) => {
            if (this.isApiGateway) {
                this.callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(obj),
                    isBase64Encoded: false,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                });
            } else {
                this.callback(null, obj);
            }
            resolve();
        });
    }

    fail(error: Error) {
        const responseObj: any = { // tslint:disable-line
            code: 500,
            msg: error.message,
        };

        if (process.env.NODE_ENV === 'production') {
            responseObj.stack = error.stack;
        }

        if (this.isApiGateway) {
            this.callback(error, {
                statusCode: 500,
                body: JSON.stringify(responseObj),
                isBase64Encoded: false,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
        } else {
            this.callback(error, responseObj);
        }

    }
}
