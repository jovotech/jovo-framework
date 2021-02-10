"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleActionAPIError extends Error {
    constructor(message, code = GoogleActionAPIError.ERROR) {
        super(message);
        this.code = code;
    }
}
exports.GoogleActionAPIError = GoogleActionAPIError;
GoogleActionAPIError.ERROR = 'ERROR';
GoogleActionAPIError.PARSE_ERROR = 'PARSE_ERROR';
//# sourceMappingURL=GoogleActionAPIError.js.map