import { RequestType } from './enums';
import { InvalidParentError } from './errors/InvalidParentError';
import { Extensible } from './Extensible';
import { NluData } from './interfaces';
import { Jovo } from './Jovo';
import { Platform } from './Platform';
import { Plugin, PluginConfig } from './Plugin';

export abstract class NluPlugin<CONFIG extends PluginConfig = PluginConfig> extends Plugin<CONFIG> {
  abstract process(jovo: Jovo): Promise<NluData | undefined>;

  install(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.constructor.name, 'Platform');
    }
    parent.middlewareCollection.use('interpretation.nlu', this.nlu);
  }

  protected nlu = async (jovo: Jovo): Promise<void> => {
    if (jovo.$type.type === RequestType.Launch || jovo.$type.type === RequestType.End) {
      jovo.$nlu = {
        intent: {
          name: jovo.$type.type,
        },
      };
    } else {
      const processResult = await this.process(jovo);
      if (processResult) {
        jovo.$nlu = processResult;
        jovo.$entities = processResult.entities || {};
      }
    }
  };
}
