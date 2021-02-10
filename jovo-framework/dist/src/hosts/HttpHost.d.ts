/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Host } from 'jovo-core';
/**
 * Jovo Host implemented using the nodejs http package https://nodejs.org/api/http.html.
 * this is also compatible with Google's AppEngine.
 */
export default class HttpHost implements Host {
    hasWriteFileAccess: boolean;
    $request: any;
    req: IncomingMessage;
    res: ServerResponse;
    headers: Record<string, any>;
    constructor(req: IncomingMessage, body: string, res: ServerResponse);
    getQueryParams(): Record<string, string>;
    getRequestObject(): any;
    setResponse(obj: any): Promise<void>;
    fail(error: Error): void;
}
