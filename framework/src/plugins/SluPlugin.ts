import { InputType } from '@jovotech/common';
import { InterpretationPlugin, InterpretationPluginConfig } from './InterpretationPlugin';

export abstract class SluPlugin<
  CONFIG extends InterpretationPluginConfig = InterpretationPluginConfig,
> extends InterpretationPlugin<CONFIG> {
  getDefaultConfig(): CONFIG {
    return {
      input: {
        supportedTypes: [InputType.Text, InputType.TranscribedSpeech, InputType.Speech],
      },
    } as CONFIG;
  }
}
