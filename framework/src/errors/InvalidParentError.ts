import { Constructor, JovoError } from '@jovotech/common';

// TODO: improve => add context @m-ripper
export class InvalidParentError extends JovoError {
  constructor(pluginName: string, assumedParentType: Constructor | string) {
    super({
      message: `${pluginName} can only be installed for plugins of type ${assumedParentType}.`,
    });
  }
}
