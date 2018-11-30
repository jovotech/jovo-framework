import {Host} from "jovo-core";

export class GoogleCloudFunction implements Host {
    headers: {[key: string]: string};
    hasWriteFileAccess = false;
    req: any; // tslint:disable-line
    res: any; // tslint:disable-line
    requestObject: any; // tslint:disable-line

    constructor(req: any, res: any) { // tslint:disable-line
        this.req = req;
        this.res = res;
        this.headers = req.headers;
        this.requestObject = req.body;
    }

    getRequestObject() {
        return this.requestObject;
    }

    setResponse(obj: any) { // tslint:disable-line
        return new Promise<void>((resolve) => {
            this.res.json(obj);
            resolve();
        });
    }
}
