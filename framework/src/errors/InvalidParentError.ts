import { JovoError, Constructor } from '@jovotech/common';

// TODO: improve
export class InvalidParentError extends JovoError {
  constructor(pluginName: string, assumedParentType: Constructor | string) {
    super({
      message: `${pluginName} can only be installed for plugins of type ${assumedParentType}.`,
    });
  }
}
