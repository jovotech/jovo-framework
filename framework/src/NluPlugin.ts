import { InvalidParentError } from './errors/InvalidParentError';
import { Extensible } from './Extensible';
import { NluData } from './interfaces';
import { Jovo } from './Jovo';
import { InputType, InputTypeLike } from './JovoInput';
import { Platform } from './Platform';
import { Plugin, PluginConfig } from './Plugin';

export interface NluPluginInputConfig {
  supportedTypes: InputTypeLike[];
}

export interface NluPluginConfig extends PluginConfig {
  input: NluPluginInputConfig;
}

export abstract class NluPlugin<
  CONFIG extends NluPluginConfig = NluPluginConfig,
> extends Plugin<CONFIG> {
  abstract process(jovo: Jovo, text: string): Promise<NluData | undefined>;

  getDefaultConfig(): CONFIG {
    return {
      input: {
        supportedTypes: [InputType.Text, InputType.TranscribedSpeech, InputType.Speech],
      },
    } as CONFIG;
  }

  install(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.constructor.name, 'Platform');
    }
    parent.middlewareCollection.use('interpretation.nlu', this.nlu);
  }

  protected isInputTypeSupported(inputType: InputTypeLike): boolean {
    return this.config.input.supportedTypes.includes(inputType);
  }

  protected nlu = async (jovo: Jovo): Promise<void> => {
    if (!jovo.$input.text || !this.isInputTypeSupported(jovo.$input.type)) {
      return;
    }
    const nluProcessResult = await this.process(jovo, jovo.$input.text);
    if (nluProcessResult) {
      jovo.$input.type = InputType.Intent;
      jovo.$input.nlu = nluProcessResult;
      jovo.$entities = nluProcessResult.entities || {};
    }
  };
}
