import { BaseOutput, Output, OutputOptions, OutputTemplate,  } from '@jovotech/framework';
import { AsinProduct } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';

export interface ConnectionBuyShoppingProductsOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  products: AsinProduct[];
}

@Output()
export class ConnectionBuyShoppingProductsOutput extends BaseOutput<ConnectionBuyShoppingProductsOutputOptions> {
  getDefaultOptions(): ConnectionBuyShoppingProductsOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      products: [],
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
                  uri: 'connection://AMAZON.BuyShoppingProducts/1',
                  input: {
                    products: this.options.products,
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
