import { JovoError } from '@jovotech/framework';

export class LanguageModelDirectoryNotFoundError extends JovoError {
  constructor(readonly languageModelPath: string) {
    super({
      message: `Can not find language model directory at ${languageModelPath}.`,
    });
  }
}
