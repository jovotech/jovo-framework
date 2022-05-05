import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export enum ImageType {
  Jpg = 'JPG',
  Jpeg = 'JPEG',
}

export interface ConnectionPrintPdfOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  title: string;
  description?: string;
  url: string;
  imageType: ImageType
}

@Output()
export class ConnectionPrintPdfOutput extends BaseOutput<ConnectionPrintPdfOutputOptions> {
  getDefaultOptions(): ConnectionPrintPdfOutputOptions {
    return {
      title: '',
      url: '',
      imageType: ImageType.Jpg,
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
                  uri: "connection://AMAZON.PrintImage/1",
                  input: {
                    "@type": "PrintImageRequest",
                    "@version": "1",
                    title: this.options.title,
                    description: this.options.description,
                    url: this.options.url,
                    imageType: this.options.imageType,
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
