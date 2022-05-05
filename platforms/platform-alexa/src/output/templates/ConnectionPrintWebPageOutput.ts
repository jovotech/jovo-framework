import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';


export interface ConnectionPrintWebPageOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  title: string;
  description?: string;
  url: string;
}

@Output()
export class ConnectionPrintWebPageOutput extends BaseOutput<ConnectionPrintWebPageOutputOptions> {
  getDefaultOptions(): ConnectionPrintWebPageOutputOptions {
    return {
      title: '',
      url: '',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: this.options.shouldEndSession,
              directives: [
                {
                  type: "Connections.StartConnection",
                  uri: "connection://AMAZON.PrintWebPage/1",
                  input: {
                    "@type": "PrintWebPageRequest",
                    "@version": "1",
                    title: this.options.title,
                    description: this.options.description,
                    url: this.options.url,
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
