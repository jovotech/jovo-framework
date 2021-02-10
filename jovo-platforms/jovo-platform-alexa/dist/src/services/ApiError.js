"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(message, code = ApiError.ERROR) {
        super(message);
        this.code = code;
    }
}
exports.ApiError = ApiError;
ApiError.PARSE_ERROR = 'PARSE_ERROR';
ApiError.ACCESS_NOT_REQUESTED = 'ACCESS_NOT_REQUESTED';
ApiError.NO_USER_PERMISSION = 'NO_USER_PERMISSION';
ApiError.NO_SKILL_PERMISSION = 'NO_SKILL_PERMISSION';
ApiError.LIST_NOT_FOUND = 'LIST_NOT_FOUND';
ApiError.ITEM_NOT_FOUND = 'ITEM_NOT_FOUND';
ApiError.ERROR = 'ERROR';
//# sourceMappingURL=ApiError.js.map