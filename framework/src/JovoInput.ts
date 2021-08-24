import { EnumLike } from '@jovotech/output';
import { AsrData, EntityMap, Intent, NluData } from './interfaces';

export enum InputType {
  Launch = 'LAUNCH',
  End = 'END',
  Error = 'ERROR',
  Intent = 'INTENT',
  Text = 'TEXT',
  TranscribedSpeech = 'TRANSCRIBED_SPEECH',
  Speech = 'SPEECH',
}

export const DEFAULT_INPUT_TYPE = InputType.Intent;

export type InputTypeLike = EnumLike<InputType> | string;

export interface AudioInput {
  base64: string;
  sampleRate: number;
}

export class JovoInput {
  asr?: AsrData;
  nlu?: NluData;
  intent?: NluData['intent'];
  entities?: EntityMap;
  text?: string;
  audio?: AudioInput;

  constructor(public type: InputTypeLike) {}

  getIntentName(): string | undefined {
    function getIntentName(intent: Intent | string): string {
      return typeof intent === 'string' ? intent : intent.name;
    }
    return this.intent
      ? getIntentName(this.intent)
      : this.nlu?.intent
      ? getIntentName(this.nlu.intent)
      : undefined;
  }
}
