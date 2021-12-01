import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConversationsTarget } from '../../interfaces';

export interface UpdatedRequestSlot {
  name: string;
  value: string;
}

export interface UpdatedRequestData {
  name: string;
  slots: Record<string, UpdatedRequestSlot>;
}

export interface UpdatedRequest {
  type: 'Dialog.InputRequest' | 'IntentRequest';
  intent?: UpdatedRequestData;
  input?: UpdatedRequestData;
}

export interface DialogDelegateRequestOutputOptions extends OutputOptions {
  target: ConversationsTarget;
  updatedRequest?: UpdatedRequest;
}

@Output()
export class DialogDelegateRequestOutput extends BaseOutput<DialogDelegateRequestOutputOptions> {
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
                  updatedRequest: this.options.updatedRequest,
                },
              ],
            },
          },
        },
      },
    };
  }
}
