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

export class JovoInput {
  asr?: AsrData;
  nlu?: NluData;

  // InputType.Intent
  intent?: NluData['intent'];
  entities?: EntityMap;

  // InputType.Text, InputType.TranscribedSpeech, InputType.Speech
  text?: string;

  // InputType.Speech
  base64Audio?: string;

  constructor(public type: InputTypeLike) {}
}
