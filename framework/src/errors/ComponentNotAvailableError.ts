import { JovoError } from '@jovotech/common';

export class ComponentNotAvailableError extends JovoError {
  constructor(componentName: string) {
    super({ message: `Component ${componentName} is not available.` });
  }
}
