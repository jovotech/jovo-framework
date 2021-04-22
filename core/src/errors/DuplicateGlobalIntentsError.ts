import ansiColors from 'ansi-colors';
import { JovoError } from '../JovoError';
import { HandlerMetadata } from '../metadata/HandlerMetadata';

// TODO improve
export class DuplicateGlobalIntentsError extends JovoError {
  constructor(entries: [string, HandlerMetadata[]][]) {
    super({
      message: 'Duplicate global intents.',
    });

    const errorTexts = entries.map(([intentName, handlers]) => {
      const textBlocks = handlers.map(
        (handler) =>
          ansiColors.yellow(handler.target.name) +
          ansiColors.white('.' + handler.propertyKey.toString()),
      );

      const startText = textBlocks.slice(0, textBlocks.length - 1);
      const text = startText.join(', ') + ` and ${textBlocks[textBlocks.length - 1]}.`;
      return ansiColors.redBright(`${ansiColors.green(`'${intentName}'`)} in ${text}`);
    });

    const errorIntroText = ansiColors.red('Duplicate global intent names detected:');
    const separator = '\n - ';
    // this.message = [errorIntroText, errorTexts.join(separator)].join(separator);
  }
}
