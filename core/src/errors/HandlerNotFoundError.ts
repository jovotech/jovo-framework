import { JovoError } from '../JovoError';

// TODO: implement
export class HandlerNotFoundError extends JovoError {
  constructor(handlerKey: string, componentName: string, componentConstructorName = componentName) {
    super('');
  }
}
