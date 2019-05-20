import { Validator, ValidationError } from './Validator';

export class IsRequiredValidator extends Validator {
    validate() {
        const input = this.inputToValidate;
        if (!input || !input.value) {
            throw new ValidationError(
                `${this.constructor.name} failed.`,
                this.constructor.name
            );
        }
    }
}