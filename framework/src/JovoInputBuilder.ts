import { InputTypeLike } from '@jovotech/common';
import { DEFAULT_INPUT_TYPE, JovoInput } from './JovoInput';

export class JovoInputBuilder {
  private readonly input: JovoInput;

  constructor(type: InputTypeLike = DEFAULT_INPUT_TYPE) {
    this.input = new JovoInput(type);
  }

  set<KEY extends keyof JovoInput>(key: KEY, value: JovoInput[KEY]): this {
    this.input[key] = value;
    return this;
  }

  build(): JovoInput {
    return this.input;
  }
}

