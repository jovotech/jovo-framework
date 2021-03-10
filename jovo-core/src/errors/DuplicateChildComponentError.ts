import ansiColors from 'ansi-colors';
import { JovoError } from '../JovoError';

export class DuplicateChildComponentError extends JovoError {
  constructor(componentName: string, parentName: string) {
    super('');

    const formattedComponentName = ansiColors.green(`'${componentName}'`);
    const formattedParentName = ansiColors.yellow(parentName);
    this.message = ansiColors.red(
      `Duplicate component-name ${formattedComponentName} found in child-components of ${formattedParentName}.`,
    );
  }
}
