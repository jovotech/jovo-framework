import { InputType } from '@jovotech/common';
import { InterpretationPlugin, InterpretationPluginConfig } from './InterpretationPlugin';

export abstract class AsrPlugin<
  CONFIG extends InterpretationPluginConfig = InterpretationPluginConfig,
> extends InterpretationPlugin<CONFIG> {
  processText = undefined;

  getDefaultConfig(): CONFIG {
    return {
      input: {
        supportedTypes: [InputType.Speech],
      },
    } as CONFIG;
  }
}
