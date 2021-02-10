import { Host } from 'jovo-core';
export declare class Lambda implements Host {
    headers: any;
    event: any;
    context: any;
    callback: any;
    isApiGateway: boolean;
    $request: any;
    responseHeaders: Record<string, string>;
    hasWriteFileAccess: boolean;
    constructor(event: any, context: any, callback: Function);
    getQueryParams(): Record<string, string>;
    getRequestObject(): any;
    setResponse(obj: any): Promise<void>;
    fail(error: Error): void;
}
