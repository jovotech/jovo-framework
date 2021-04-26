import { JovoError } from '../JovoError';

// TODO: improve
export class ComponentNotFoundError extends JovoError {
  constructor(componentPath: string[]) {
    super({
      message: `Could not find component ${
        componentPath[componentPath.length - 1]
      } at ${componentPath.join('.')} or in root.`,
    });
  }
}
