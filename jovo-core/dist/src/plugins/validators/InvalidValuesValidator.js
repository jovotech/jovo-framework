"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JovoError_1 = require("../../errors/JovoError");
const Validator_1 = require("./Validator");
const ValidatorError_1 = require("./ValidatorError");
class InvalidValuesValidator extends Validator_1.Validator {
    constructor(invalidValues = []) {
        super();
        this.invalidValues = [];
        this.invalidValues = invalidValues;
    }
    /**
     * Filters the current request input data for invalid values.
     * @throws ValidationError if input data is invalid.
     * @throws JovoError if value is not of type string|RegExp.
     */
    validate() {
        const input = this.inputToValidate;
        if (!input || !input.value) {
            throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
        }
        for (const v of this.invalidValues) {
            if (typeof v === 'string') {
                if (input.value.toLowerCase() === v.toLowerCase()) {
                    throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
                }
            }
            else if (v instanceof RegExp) {
                if (v.test(input.value)) {
                    throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
                }
            }
            else {
                throw new JovoError_1.JovoError('Value type is not supported.', JovoError_1.ErrorCode.ERR, 'jovo-core', undefined, 'Please only use the supported value types string|RegExp.');
            }
        }
    }
}
exports.InvalidValuesValidator = InvalidValuesValidator;
//# sourceMappingURL=InvalidValuesValidator.js.map