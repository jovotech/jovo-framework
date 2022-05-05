import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

@Output()
export class LinkAccountCardOutput extends BaseOutput {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      listen: false,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              card: {
                type: 'LinkAccount',
              },
            },
          },
        },
      },
    };
  }
}
