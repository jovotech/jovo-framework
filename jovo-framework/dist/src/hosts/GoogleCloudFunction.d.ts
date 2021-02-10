import { Host } from 'jovo-core';
export declare class GoogleCloudFunction implements Host {
    headers: {
        [key: string]: string;
    };
    hasWriteFileAccess: boolean;
    req: any;
    res: any;
    $request: any;
    constructor(req: any, res: any);
    getQueryParams(): Record<string, string>;
    getRequestObject(): any;
    setResponse(obj: any): Promise<void>;
    fail(error: Error): void;
}
