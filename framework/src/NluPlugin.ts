import { RequestType } from './enums';
import { InvalidParentError } from './errors/InvalidParentError';
import { Extensible } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { NluData } from './interfaces';
import { Jovo } from './Jovo';
import { Platform } from './Platform';
import { Plugin, PluginConfig } from './Plugin';

export abstract class NluPlugin<CONFIG extends PluginConfig = PluginConfig> extends Plugin<CONFIG> {
  abstract process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined>;

  initialize(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.constructor.name, 'Platform');
    }
  }

  mount(parent: Extensible): Promise<void> | void {
    parent.middlewareCollection.use('$nlu', this.nlu);
  }

  protected nlu = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    if (jovo.$type.type === RequestType.Launch || jovo.$type.type === RequestType.End) {
      jovo.$nlu = {
        intent: {
          name: jovo.$type.type,
        },
      };
    } else {
      const processResult = await this.process(handleRequest, jovo);
      if (processResult) {
        jovo.$nlu = processResult;
      }
    }
  };
}
