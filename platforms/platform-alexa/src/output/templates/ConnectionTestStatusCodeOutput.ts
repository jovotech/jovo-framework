import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';


export interface ConnectionTestStatusCodeOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  code: string;
}

@Output()
export class ConnectionTestStatusCodeOutput extends BaseOutput<ConnectionTestStatusCodeOutputOptions> {
  getDefaultOptions(): ConnectionTestStatusCodeOutputOptions {
    return {
      code: '404',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: this.options.shouldEndSession,
              directives: [
                {
                  type: "Connections.StartConnection",
                  uri: "connection://AMAZON.TestStatusCode/1",
                  input: {
                    code: this.options.code,
                  },
                  token: this.options.token
                }
              ],
            },
          },
        },
      },
    };
  }
}
