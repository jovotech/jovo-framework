import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface ApiResponseOutputOptions extends OutputOptions {
  apiResponse: Record<string, string | number | boolean>;
}

@Output()
export class ApiResponseOutput extends BaseOutput<ApiResponseOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      listen: this.options.listen,
      platforms: {
        alexa: {
          nativeResponse: {
            version: '1.0',
            sessionAttributes: {},
            response: {
              apiResponse: this.options.apiResponse,
            },
          },
        },
      },
    };
  }
}
