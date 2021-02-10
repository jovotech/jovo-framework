export declare class GoogleActionAPIError extends Error {
    static ERROR: string;
    static PARSE_ERROR: string;
    code: string;
    constructor(message: string, code?: string);
}
