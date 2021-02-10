"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JovoError_1 = require("../../errors/JovoError");
const Validator_1 = require("./Validator");
const ValidatorError_1 = require("./ValidatorError");
class ValidValuesValidator extends Validator_1.Validator {
    constructor(validValues = []) {
        super();
        this.validValues = [];
        // this.validValues = validValues.map(v => v.toLowerCase());
        this.validValues = validValues;
    }
    /**
     * Filters the current request input data for valid values.
     * @throws ValidationError if input data is not valid.
     * @throws JovoError if value type is not of type string|RegExp.
     */
    validate() {
        const input = this.inputToValidate;
        if (!input || !input.value) {
            throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
        }
        for (const v of this.validValues) {
            if (typeof v === 'string') {
                if (input.value.toLowerCase() === v.toLowerCase()) {
                    return;
                }
            }
            else if (v instanceof RegExp) {
                if (v.test(input.value)) {
                    return;
                }
            }
            else {
                throw new JovoError_1.JovoError('Value type is not supported.', JovoError_1.ErrorCode.ERR, 'jovo-core', undefined, 'Please only use the supported value types string|RegExp.');
            }
        }
        throw new ValidatorError_1.ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
    }
}
exports.ValidValuesValidator = ValidValuesValidator;
//# sourceMappingURL=ValidValuesValidator.js.map