import { Validator } from './Validator';
import { ValidationError } from './ValidatorError';

export class IsRequiredValidator extends Validator {
  /**
   * Checks if the current request input data is required or not.
   * @throws ValidationError if input is not present.
   */
  validate() {
    const input = this.inputToValidate;
    if (!input || !input.value) {
      throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
    }
  }
}
