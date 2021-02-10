export declare class ApiError extends Error {
    static PARSE_ERROR: string;
    static ACCESS_NOT_REQUESTED: string;
    static NO_USER_PERMISSION: string;
    static NO_SKILL_PERMISSION: string;
    static LIST_NOT_FOUND: string;
    static ITEM_NOT_FOUND: string;
    static ERROR: string;
    code: string;
    constructor(message: string, code?: string);
}
