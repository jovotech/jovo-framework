export declare class ValidationError extends Error {
    validator: string;
    message: string;
    constructor(validator: string, message?: string);
}
