import {
  AsrData,
  AudioInput,
  EntityMap,
  Input,
  InputType,
  InputTypeLike,
  Intent,
  NluData,
} from '@jovotech/common';

export const DEFAULT_INPUT_TYPE = InputType.Intent;

export class JovoInput implements Input {
  type: InputTypeLike;
  asr?: AsrData;
  nlu?: NluData;
  intent?: NluData['intent'];
  entities?: EntityMap;
  text?: string;
  audio?: AudioInput;

  constructor(typeOrObject: InputTypeLike | Input = DEFAULT_INPUT_TYPE) {
    // make sure a type always exists, due to the possibility of passing a partial input-object, a type could be omitted
    this.type = typeof typeOrObject === 'string' ? typeOrObject : DEFAULT_INPUT_TYPE;
    if (typeof typeOrObject === 'object') {
      Object.assign(this, typeOrObject);
    }
  }

  getText(): string | undefined {
    return this.text || this.asr?.text;
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
