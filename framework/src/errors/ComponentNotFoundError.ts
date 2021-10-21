import { JovoError } from '@jovotech/framework';

// TODO: improve
export class ComponentNotFoundError extends JovoError {
  constructor(componentPath: string[]) {
    super({
      message: `Could not find component ${
        componentPath[componentPath.length - 1]
      } neither in children of ${componentPath.join('.')} nor in root.`,
    });
  }
}
