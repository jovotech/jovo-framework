import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface IspBuyOutputOptions extends OutputOptions {
  token?: string;
  productId: string;
}

@Output()
export class IspBuyOutput extends BaseOutput<IspBuyOutputOptions> {
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
                  name: 'Buy',
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
