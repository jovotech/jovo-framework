import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';

export enum ImageType {
  Jpg = 'JPG',
  Jpeg = 'JPEG',
}

export interface ConnectionPrintImageOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  title: string;
  description?: string;
  url: string;
  imageType: ImageType;
}

@Output()
export class ConnectionPrintImageOutput extends BaseOutput<ConnectionPrintImageOutputOptions> {
  getDefaultOptions(): ConnectionPrintImageOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      title: '',
      url: '',
      imageType: ImageType.Jpg,
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
                  uri: 'connection://AMAZON.PrintImage/1',
                  input: {
                    '@type': 'PrintImageRequest',
                    '@version': '1',
                    'title': this.options.title,
                    'description': this.options.description,
                    'url': this.options.url,
                    'imageType': this.options.imageType,
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
