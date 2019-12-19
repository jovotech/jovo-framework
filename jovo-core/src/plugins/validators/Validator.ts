import { Jovo } from '../../core/Jovo';

export abstract class Validator {
  inputToValidate: { [key: string]: any } | undefined; // tslint:disable-line:no-any

  /**
   * Set current input to validate.
   * @param input
   */
  setInputToValidate(input: any) {
    // tslint:disable-line:no-any
    this.inputToValidate = input;
  }

  /**
   * Main function for validators.
   * @param jovo Optional jovo object for accessing more data.
   */
  abstract validate(jovo?: Jovo): void;
}
