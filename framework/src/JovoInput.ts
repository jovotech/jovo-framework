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
  constructor(public type: TYPE | `${TYPE}`) {}
}

export type JovoInput = TypeJovoInput | IntentJovoInput | TextJovoInput | SpeechJovoInput;

export class TypeJovoInput extends JovoInputBase<
  InputType.Launch | InputType.End | InputType.Error
> {}

export class IntentJovoInput extends JovoInputBase<InputType.Intent> {
  constructor(public intent: string, public entities?: EntityMap) {
    super(InputType.Intent);
  }
}

export class TextJovoInput extends JovoInputBase<InputType.Text | InputType.TranscribedSpeech> {
  nlu?: NluData;

  constructor(public text: string) {
    super(InputType.Text);
  }
}

export class SpeechJovoInput extends JovoInputBase<InputType.Speech> {
  asr?: AsrData;
  nlu?: NluData;

  constructor(public speech: string) {
    super(InputType.Speech);
  }
}
