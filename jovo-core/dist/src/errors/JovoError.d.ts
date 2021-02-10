export declare enum ErrorCode {
    ERR = "ERR",
    ERR_PLUGIN = "ERR_PLUGIN"
}
export declare class JovoError extends Error {
    /**
     * Prints JovoError instance in an uniformed style.
     * @param {JovoError} e
     */
    static printError(e: JovoError): void;
    code: ErrorCode | string;
    module: string | undefined;
    details: string | undefined;
    hint: string | undefined;
    seeMore: string | undefined;
    constructor(message: string, code?: ErrorCode | string, module?: string, details?: string, hint?: string, seeMore?: string);
}
