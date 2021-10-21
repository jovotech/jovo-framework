import { EnumLike } from '@jovotech/output';
import { OmitWhere } from '@jovotech/common';
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

// eslint-disable-next-line @typescript-eslint/ban-types
export type JovoInputObject = Partial<OmitWhere<JovoInput, Function>>;

export type InputTypeLike = EnumLike<InputType> | string;

export interface AudioInput {
  base64: string;
  sampleRate: number;
}

export class JovoInput {
  type: InputTypeLike;
  asr?: AsrData;
  nlu?: NluData;
  intent?: NluData['intent'];
  entities?: EntityMap;
  text?: string;
  audio?: AudioInput;

  constructor(typeOrObject: InputTypeLike | JovoInputObject = DEFAULT_INPUT_TYPE) {
    // make sure a type always exists, due to the possibility of passing a partial input-object, a type could be omitted
    this.type = typeof typeOrObject === 'string' ? typeOrObject : DEFAULT_INPUT_TYPE;
    if (typeof typeOrObject === 'object') {
      Object.assign(this, typeOrObject);
    }
  }

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
