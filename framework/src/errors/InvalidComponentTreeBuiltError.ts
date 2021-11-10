import { JovoError } from '@jovotech/common';
import { DuplicateChildComponentsError } from './DuplicateChildComponentsError';

export class InvalidComponentTreeBuiltError extends JovoError {
  constructor(errors: Array<Error | DuplicateChildComponentsError>) {
    super({
      message: `Invalid ComponentTree was built:${errors.map((error) => `\n- ${error}`)}`,
    });
  }
}
