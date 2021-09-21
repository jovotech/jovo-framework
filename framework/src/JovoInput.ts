import { EnumLike } from '@jovotech/output';
import { OmitWhere } from '.';
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
export type JovoInputObject = OmitWhere<JovoInput, Function>;

export type InputTypeLike = EnumLike<InputType> | string | JovoInputObject;

export interface AudioInput {
  base64: string;
  sampleRate: number;
}

export class JovoInput {
  type!: EnumLike<InputType> | string;
  asr?: AsrData;
  nlu?: NluData;
  intent?: NluData['intent'];
  entities?: EntityMap;
  text?: string;
  audio?: AudioInput;

  constructor(type: InputTypeLike) {
    if (isObject(type)) {
      Object.assign(this, type);
    } else {
      this.type = type;
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

function isObject(input: InputTypeLike): input is JovoInputObject {
  return typeof input === 'object';
}
