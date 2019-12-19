import { ErrorCode, JovoError } from '../../errors/JovoError';
import { Validator } from './Validator';
import { ValidationError } from './ValidatorError';

export class InvalidValuesValidator extends Validator {
  invalidValues: Array<string | RegExp> = [];

  constructor(invalidValues: Array<string | RegExp> = []) {
    super();
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
      throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
    }

    for (const v of this.invalidValues) {
      if (typeof v === 'string') {
        if (input.value.toLowerCase() === v.toLowerCase()) {
          throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
        }
      } else if (v instanceof RegExp) {
        if (v.test(input.value)) {
          throw new ValidationError(this.constructor.name, `${this.constructor.name} failed.`);
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
  }
}
