import { JovoError } from '@jovotech/common';

export class NotInitializedError extends JovoError {
  constructor(name: string) {
    super({
      message: `${name} has to be initialized before being used.`,
    });
  }
}
