import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

@Output()
export class AccountLinkCardOutput extends BaseOutput {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      listen: false,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              card: {
                type: 'LinkAccount'
              }
            }
          }
        }
      }
    };
  }
}
