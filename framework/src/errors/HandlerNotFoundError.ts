import { JovoError } from '../JovoError';

// TODO: improve
export class HandlerNotFoundError extends JovoError {
  constructor(className: string, handlerKey: string) {
    super({
      message: `Could not find handler ${handlerKey} in component ${className}.`,
    });
  }
}
