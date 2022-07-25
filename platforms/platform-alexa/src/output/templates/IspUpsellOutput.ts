import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface IspUpsellOutputOptions extends OutputOptions {
  token?: string;
  productId: string;
  upsellMessage: string;
}

@Output()
export class IspUpsellOutput extends BaseOutput<IspUpsellOutputOptions> {
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
                  name: 'Upsell',
                  payload: {
                    InSkillProduct: {
                      productId: this.options.productId,
                    },
                    upsellMessage: this.options.upsellMessage,
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
