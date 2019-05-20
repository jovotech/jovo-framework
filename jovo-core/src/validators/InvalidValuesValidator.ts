import { Validator, ValidationError } from './Validator';
import { JovoError } from '../errors/JovoError';

export class InvalidValuesValidator extends Validator {
    invalidValues: Array<string | RegExp> = [];
    constructor(invalidValues: Array<string | RegExp> = []) {
        super();
        this.invalidValues = invalidValues;
    }

    validate() {
        const input = this.inputToValidate;

        if (!input || !input.value) {
            return;
        }

        for (const v of this.invalidValues) {
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