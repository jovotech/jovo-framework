import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface ApiResponseOptions extends OutputOptions {
  apiResponse: Record<string, string | number | boolean>;
}

@Output()
export class ApiResponse extends BaseOutput<ApiResponseOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
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
