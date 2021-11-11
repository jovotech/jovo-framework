import { InputType, InputTypeLike, NluData } from '@jovotech/common';
import { InvalidParentError } from '../errors/InvalidParentError';
import { Extensible } from '../Extensible';
import { Jovo } from '../Jovo';
import { Platform } from '../Platform';
import { Plugin, PluginConfig } from '../Plugin';

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

  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.name, 'Platform');
    }
    parent.middlewareCollection.use('interpretation.nlu', (jovo) => {
      return this.nlu(jovo);
    });
  }

  protected isInputTypeSupported(inputType: InputTypeLike): boolean {
    return this.config.input.supportedTypes.includes(inputType);
  }

  protected async nlu(jovo: Jovo): Promise<void> {
    if (!jovo.$input.text || !this.isInputTypeSupported(jovo.$input.type)) {
      return;
    }
    const nluProcessResult = await this.process(jovo, jovo.$input.text);
    if (nluProcessResult) {
      jovo.$input.nlu = nluProcessResult;
      jovo.$entities = nluProcessResult.entities || {};
    }
  }
}
