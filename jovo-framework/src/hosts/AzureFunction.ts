import {Host} from "jovo-core";

export class AzureFunction implements Host {
    headers: {[key: string]: string};
    hasWriteFileAccess = false;
    req: any; // tslint:disable-line
    context: any; // tslint:disable-line
    requestObject: any; // tslint:disable-line

    constructor(context: any, req: any) { // tslint:disable-line
        this.req = req;
        this.context = context;
        this.headers = req.headers;
        this.requestObject = req.body;
    }

    getRequestObject() {
        return this.requestObject;
    }

    setResponse(obj: any) { // tslint:disable-line
        return new Promise<void>((resolve) => {
            this.context.res = {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: 200,
                body: obj,
            };
            this.context.done();
            resolve();
        });
    }
}
