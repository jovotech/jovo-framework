import { JovoError } from '@jovotech/framework';

// TODO: improve
export class HandlerNotFoundError extends JovoError {
  constructor(className: string, handler: string) {
    super({
      message: `Could not find handler ${handler} in component ${className}.`,
    });
  }
}
