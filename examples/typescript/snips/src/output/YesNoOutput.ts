import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

@Output()
export class YesNoOutput extends BaseOutput {
  /*
    |--------------------------------------------------------------------------
    | Output Template
    |--------------------------------------------------------------------------
    |
    | This structured output is later turned into a native response
    | Learn more here: www.jovo.tech/docs/output
    |
    */
  build(): OutputTemplate | OutputTemplate[] {
    return {
      quickReplies: ['yes', 'no'],
      listen: {
        intents: [ 'YesIntent', 'NoIntent' ], // @see https://www.jovo.tech/marketplace/nlu-snips#intent-scoping
      },
    };
  }
}
