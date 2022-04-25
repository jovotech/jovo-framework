import { Input, InputTypeLike } from '@jovotech/common';
import { DEFAULT_INPUT_TYPE, JovoInput } from './JovoInput';

export class JovoInputBuilder {
  private readonly input: JovoInput;

  constructor(inputTypeOrObject: InputTypeLike | Input = DEFAULT_INPUT_TYPE) {
    this.input = new JovoInput(inputTypeOrObject);
  }

  set<KEY extends keyof JovoInput>(key: KEY, value: JovoInput[KEY]): this {
    if (value) {
      this.input[key] = value;
    }
    return this;
  }

  build(): JovoInput {
    return this.input;
  }
}
