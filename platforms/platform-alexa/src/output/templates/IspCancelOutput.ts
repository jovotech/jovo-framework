import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface IspCancelOutputOptions extends OutputOptions {
  token?: string;
  productId: string;
}

@Output()
export class IspCancelOutput extends BaseOutput<IspCancelOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: true,
              directives: [
                {
                  type: 'Connections.SendRequest',
                  name: 'Cancel',
                  payload: {
                    InSkillProduct: {
                      productId: this.options.productId,
                    },
                  },
                  token: this.options.token || '',
                },
              ],
            },
          },
        },
      },
    };
  }
}
