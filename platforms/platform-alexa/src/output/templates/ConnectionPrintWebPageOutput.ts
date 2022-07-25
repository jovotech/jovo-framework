import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';

export interface ConnectionPrintWebPageOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  title: string;
  description?: string;
  url: string;
}

@Output()
export class ConnectionPrintWebPageOutput extends BaseOutput<ConnectionPrintWebPageOutputOptions> {
  getDefaultOptions(): ConnectionPrintWebPageOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      title: '',
      url: '',
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
                  uri: 'connection://AMAZON.PrintWebPage/1',
                  input: {
                    '@type': 'PrintWebPageRequest',
                    '@version': '1',
                    'title': this.options.title,
                    'description': this.options.description,
                    'url': this.options.url,
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
