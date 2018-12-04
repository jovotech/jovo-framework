import {Host} from "jovo-core";

export class GoogleCloudFunction implements Host {
    headers: {[key: string]: string};
    hasWriteFileAccess = false;
    req: any; // tslint:disable-line
    res: any; // tslint:disable-line
    $request: any; // tslint:disable-line


    constructor(req: any, res: any) { // tslint:disable-line
        this.req = req;
        this.res = res;
        this.headers = req.headers;
        this.$request = req.body;
    }

    getRequestObject() {
        return this.$request;
    }

    setResponse(obj: any) { // tslint:disable-line
        return new Promise<void>((resolve) => {
            this.res.json(obj);
            resolve();
        });
    }
}
