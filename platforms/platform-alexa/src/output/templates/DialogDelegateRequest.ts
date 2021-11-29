import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export type Target = 'AMAZON.Conversations' | 'skill';

export interface UpdatedRequestSlot {
  name: string;
  value: string;
}

export interface UpdatedRequestData {
  name: string;
  slots: Record<string, UpdatedRequestSlot>;
}

export interface UpdatedRequest<TARGET extends Target> {
  type: TARGET extends 'AMAZON.Conversations' ? 'Dialog.InputRequest' : 'IntentRequest';
  intent: TARGET extends 'AMAZON.Conversations' ? never : UpdatedRequestData;
  input: TARGET extends 'AMAZON.Conversations' ? UpdatedRequestData : never;
}

export interface DialogDelegateRequestOptions<TARGET extends Target> extends OutputOptions {
  target: TARGET;
  updatedRequest: UpdatedRequest<TARGET>;
}

@Output()
export class DialogDelegateRequest extends BaseOutput<DialogDelegateRequestOptions> {
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
