import { BaseOutput } from '@jovotech/framework';

export class WelcomeOutput extends BaseOutput {
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
      message: 'Hello World!',
    };
  }

  constructor(jovo) {
    super(jovo);
  }
}
