import { Host } from './Interfaces';
export declare class TestHost implements Host {
    headers: {
        [key: string]: string;
    };
    hasWriteFileAccess: boolean;
    req: any;
    $request: any;
    res: any;
    err: Error | undefined;
    failed: boolean;
    constructor(req: any);
    /**
     * Full request object
     * @returns {any}
     */
    getRequestObject(): any;
    /**
     * Save the response
     * @param obj
     * @returns {Promise<any>}
     */
    setResponse(obj: any): Promise<void>;
    getQueryParams(): Record<string, string>;
    /**
     * Return the previously set response object
     */
    getResponse(): any;
    /**
     * Save the error and set failed flag
     * @param error
     */
    fail(error: Error): void;
    /**
     * Return the previously set error
     * @returns Error
     */
    getError(): Error;
    /**
     * Returns true if an error occurred while handling the request
     */
    didFail(): boolean;
}
