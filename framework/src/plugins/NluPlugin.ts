import { InputType } from '@jovotech/common';
import { InterpretationPlugin, InterpretationPluginConfig } from './InterpretationPlugin';

// alias for backwards compatibility, could be replaced by an interface and extended later
export type NluPluginConfig = InterpretationPluginConfig;

export abstract class NluPlugin<
  CONFIG extends InterpretationPluginConfig = InterpretationPluginConfig,
> extends InterpretationPlugin<CONFIG> {
  targetSampleRate = undefined;
  processAudio = undefined;

  getDefaultConfig(): CONFIG {
    return {
      input: {
        supportedTypes: [InputType.Text, InputType.TranscribedSpeech, InputType.Speech],
      },
    } as CONFIG;
  }
}
