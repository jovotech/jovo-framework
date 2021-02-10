"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("./Validator");
const ValidatorError_1 = require("./ValidatorError");
class IsRequiredValidator extends Validator_1.Validator {
    /**
     * Checks if the current request input data is required or not.
     * @throws ValidationError if input is not present.
     */
    validate() {
        const input = this.inputToValidate;
        if (!input || !input.value) {
            throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
        }
    }
}
exports.IsRequiredValidator = IsRequiredValidator;
//# sourceMappingURL=IsRequiredValidator.js.map