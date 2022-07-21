import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';

export interface ConnectionTestStatusCodeOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  code: string;
}

@Output()
export class ConnectionTestStatusCodeOutput extends BaseOutput<ConnectionTestStatusCodeOutputOptions> {
  getDefaultOptions(): ConnectionTestStatusCodeOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      code: '404',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    const shouldEndSession =
      this.options.onCompletion === OnCompletion.SendErrorsOnly
        ? true
        : this.options.shouldEndSession;

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession,
              directives: [
                {
                  type: 'Connections.StartConnection',
                  uri: 'connection://AMAZON.TestStatusCode/1',
                  input: {
                    code: this.options.code,
                  },
                  token: this.options.token,
                  onCompletion: this.options.onCompletion,
                },
              ],
            },
          },
        },
      },
    };
  }
}
