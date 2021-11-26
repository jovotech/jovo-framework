import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface SendDialogDelegateRequestOptions extends OutputOptions {
  target: 'AMAZON.Conversations' | 'skill';
}

@Output()
export class SendDialogDelegateRequest extends BaseOutput<SendDialogDelegateRequestOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      platforms: {
        alexa: {
          nativeResponse: {
            version: '1.0',
            sessionAttributes: {},
            response: {
              directives: [
                {
                  type: 'Dialog.DelegateRequest',
                  target: this.options.target,
                  period: {
                    until: 'EXPLICIT_RETURN',
                  },
                },
              ],
            },
          },
        },
      },
    };
  }
}
