import { JovoError } from '@jovotech/common';

export class ComponentNotAvailableError extends JovoError {
  constructor(readonly componentName: string) {
    super({ message: `Component ${componentName} is not available.` });
  }
}
