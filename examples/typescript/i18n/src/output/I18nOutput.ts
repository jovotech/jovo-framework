import {
  BaseOutput,
  Output,
  OutputOptions,
  OutputTemplate,
  I18NextAutoPath,
} from '@jovotech/framework';

export interface I18nOutputOptions extends OutputOptions {
  // key: I18NextAutoPath;
  key: string;
}

@Output()
export class I18nOutput extends BaseOutput<I18nOutputOptions> {
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
    const key = this.options.key;
    return {
      message: `${this.$t(`${key}.message`)} ${this.$t(`${key}.prompt`)}`,
      reprompt: this.$t(`${key}.prompt`),
    };
  }
}
