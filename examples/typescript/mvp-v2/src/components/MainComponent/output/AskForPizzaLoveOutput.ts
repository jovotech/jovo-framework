import { Jovo, BaseOutput } from '@jovotech/framework';

export class AskForPizzaLoveOutput extends BaseOutput {
  /*
    |--------------------------------------------------------------------------
    | Output Template
    |--------------------------------------------------------------------------
    |
    | This structured output is later turned into a native response
    | Learn more here: www.jovo.tech/docs/output
    |
    */
  build() {
    return {
      message: 'Hello World! Do you like pizza?',
      listen: true,
    };
  }

  constructor(jovo: Jovo) {
    super(jovo);
  }
}
