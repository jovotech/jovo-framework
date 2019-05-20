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
                    throw new ValidationError(
                        `${this.constructor.name} failed.`,
                        this.constructor.name
                    );
                }
            } else if (v instanceof RegExp) {
                if (v.test(input.value)) {
                    throw new ValidationError(
                        `${this.constructor.name} failed.`,
                        this.constructor.name
                    );
                }
            } else {
                throw new JovoError(
                    'Value type is not supported.'
                );
            }
        }
    }
}