import { Request, Response } from 'express';
import { Host, JovoRequest } from 'jovo-core';
export declare class ExpressJS implements Host {
    headers: Record<string, string>;
    hasWriteFileAccess: boolean;
    req: Request;
    res: Response;
    $request: any;
    constructor(req: any, res: any);
    static dummyRequest(jovoRequest: JovoRequest): ExpressJS;
    getQueryParams(): Record<string, string>;
    getRequestObject(): any;
    setResponse(obj: any): Promise<void>;
    fail(error: Error): void;
}
