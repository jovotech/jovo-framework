import { Validator, ValidationError } from './Validator';
import { JovoError, ErrorCode } from '../errors/JovoError';

export class ValidValuesValidator extends Validator {
    validValues: Array<string | RegExp> = [];
    constructor(validValues: Array<string | RegExp> = []) {
        super();
        // this.validValues = validValues.map(v => v.toLowerCase());
        this.validValues = validValues;
    }

    validate() {
        const input = this.inputToValidate;

        if (!input || !input.value) {
            // TODO return to onFail? return true? -> would replace isrequiredvalidator, maybe extend IsRequired?
            return;
        }

        for (const v of this.validValues) {
            if (typeof v === 'string') {
                if (input.value.toLowerCase() === v.toLowerCase()) {
                    return;
                }
            } else if (v instanceof RegExp) {
                if (v.test(input.value)) {
                    return;
                }
            } else {
                throw new JovoError(
                    'Value type is not supported.'
                );
            }
        }

        throw new ValidationError(
            `${this.constructor.name} failed.`,
            this.constructor.name
        );
    }
}