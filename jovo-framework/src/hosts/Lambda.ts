import {Host} from "jovo-core";

export class Lambda implements Host {
    headers: any; // tslint:disable-line
    event: any; // tslint:disable-line
    context: any; // tslint:disable-line
    callback: any; // tslint:disable-line
    isApiGateway = false;
    requestObject: any; // tslint:disable-line
    hasWriteFileAccess = false;

    constructor(event: any, context: any, callback: Function) { // tslint:disable-line
        this.event = event;
        this.context = context;
        this.callback = callback;
        if (event.body) {
            this.isApiGateway = true;
            this.requestObject = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body;
        } else {
            this.requestObject = event;
        }
    }
    getRequestObject() {
        return this.requestObject;
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
}
