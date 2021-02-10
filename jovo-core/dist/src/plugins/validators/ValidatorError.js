"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(validator, message = '') {
        super(message);
        this.validator = validator;
        this.message = message;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidatorError.js.map