import ansiColors from 'ansi-colors';
import { JovoError } from '../JovoError';

// TODO improve
export class DuplicateChildComponentsError extends JovoError {
  constructor(componentName: string, parentName: string) {
    super({
      message: `Duplicate component-name ${componentName} found in child-components of ${parentName}.`,
    });
    const formattedComponentName = ansiColors.green(`'${componentName}'`);
    const formattedParentName = ansiColors.yellow(parentName);
    // this.message = ansiColors.red(
    //   `Duplicate component-name ${formattedComponentName} found in child-components of ${formattedParentName}.`,
    // );
  }
}
