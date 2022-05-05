import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';


export interface ConnectionPrintPdfOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  title: string;
  description?: string;
  url: string;
}

@Output()
export class ConnectionPrintPdfOutput extends BaseOutput<ConnectionPrintPdfOutputOptions> {
  getDefaultOptions(): ConnectionPrintPdfOutputOptions {
    return {
      title: '',
      url: '',
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
                  uri: "connection://AMAZON.PrintPDF/1",
                  input: {
                    "@type": "PrintPDFRequest",
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
