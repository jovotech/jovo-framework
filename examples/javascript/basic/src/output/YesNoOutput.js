import { BaseOutput, Output } from '@jovotech/framework';

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
  build() {
    return {
      quickReplies: ['yes', 'no'],
      listen: true,
    };
  }
}
