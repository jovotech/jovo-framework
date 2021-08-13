import { InvalidParentError } from './errors/InvalidParentError';
import { Extensible } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { NluData } from './interfaces';
import { Jovo } from './Jovo';
import { InputType } from './JovoInput';
import { Platform } from './Platform';
import { Plugin, PluginConfig } from './Plugin';

export abstract class NluPlugin<CONFIG extends PluginConfig = PluginConfig> extends Plugin<CONFIG> {
  abstract process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined>;

  install(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.constructor.name, 'Platform');
    }
    parent.middlewareCollection.use('$nlu', this.nlu);
  }

  protected nlu = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    // if it's start or end, just skip
    if ([InputType.Launch, InputType.End].includes(jovo.$input.type)) {
      return;
    }
    // otherwise call the process-method and use result-data if it exists
    const nluProcessResult = await this.process(handleRequest, jovo);
    if (nluProcessResult) {
      jovo.$input.nlu = nluProcessResult;
      jovo.$entities = nluProcessResult.entities || {};
    }
  };
}
