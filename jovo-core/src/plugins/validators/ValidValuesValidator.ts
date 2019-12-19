import { ErrorCode, JovoError } from '../../errors/JovoError';
import { Validator } from './Validator';
import { ValidationError } from './ValidatorError';

export class ValidValuesValidator extends Validator {
  validValues: Array<string | RegExp> = [];

  constructor(validValues: Array<string | RegExp> = []) {
    super();
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
      throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
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
          'Value type is not supported.',
          ErrorCode.ERR,
          'jovo-core',
          undefined,
          'Please only use the supported value types string|RegExp.',
        );
      }
    }

    throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
  }
}
