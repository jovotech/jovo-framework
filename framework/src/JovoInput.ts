import { EnumLike } from '@jovotech/output';
import { AsrData, EntityMap, NluData } from './interfaces';

export enum InputType {
  Launch = 'LAUNCH',
  End = 'END',
  Error = 'ERROR',
  Intent = 'INTENT',
  Text = 'TEXT',
  TranscribedSpeech = 'TRANSCRIBED_SPEECH ',
  Speech = 'SPEECH',
}

export type InputTypeLike = EnumLike<InputType> | string;

export abstract class JovoInputBase<TYPE extends InputTypeLike = InputTypeLike> {
  asr?: AsrData;
  nlu?: NluData;

  constructor(public type: TYPE) {}
}

export class IntentJovoInput extends JovoInputBase<InputType.Intent> {
  constructor(public intent: string, public entities?: EntityMap) {
    super(InputType.Intent);
  }
}

export class TextJovoInput extends JovoInputBase<InputType.Text | InputType.TranscribedSpeech> {
  constructor(public text: string) {
    super(InputType.Text);
  }
}

export class SpeechJovoInput extends JovoInputBase<InputType.Speech> {
  constructor(public speech: string) {
    super(InputType.Speech);
  }
}

export class TypeJovoInput extends JovoInputBase<
  InputType.Launch | InputType.End | InputType.Error
> {}

// TODO implement handling for custom input types
export type JovoInput = IntentJovoInput | TextJovoInput | SpeechJovoInput | TypeJovoInput;
