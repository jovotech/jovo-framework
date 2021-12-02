import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConversationsTarget } from '../../interfaces';

export interface UpdatedRequestSlot {
  name: string;
  value: string;
}

export interface UpdatedRequestData {
  name: string;
  slots?: Record<string, UpdatedRequestSlot>;
}

export interface UpdatedIntentRequest {
  type: 'IntentRequest';
  intent: UpdatedRequestData;
}

export interface UpdatedInputRequest {
  type: 'Dialog.InputRequest';
  input: UpdatedRequestData;
}

export interface DialogDelegateRequestIntentOutputOptions extends OutputOptions {
  target: 'skill';
  updatedRequest?: UpdatedIntentRequest;
}

export interface DialogDelegateRequestInputOutputOptions extends OutputOptions {
  target: 'AMAZON.Conversations';
  updatedRequest?: UpdatedInputRequest;
}

@Output()
export class DialogDelegateRequestOutput extends BaseOutput<
  DialogDelegateRequestInputOutputOptions | DialogDelegateRequestIntentOutputOptions
> {
  build(): OutputTemplate | OutputTemplate[] {
    const getSlotsFromEntities = (): Record<string, UpdatedRequestSlot> => {
      return Object.entries(this.$entities).reduce(
        (slots: Record<string, UpdatedRequestSlot>, [entityKey, entity]) => {
          slots[entityKey] = {
            name: entityKey,
            value: entity!.value,
          };
          return slots;
        },
        {},
      );
    };

    // If dialog is delegated back to Jovo and slots are omitted, set them automatically
    if (
      this.options.target === 'skill' &&
      this.options.updatedRequest?.intent &&
      !this.options.updatedRequest.intent.slots
    ) {
      this.options.updatedRequest.intent.slots = getSlotsFromEntities();
    }

    if (
      this.options.target === 'AMAZON.Conversations' &&
      this.options.updatedRequest?.input &&
      !this.options.updatedRequest.input.slots
    ) {
      this.options.updatedRequest.input.slots = getSlotsFromEntities();
    }

    return {
      platforms: {
        alexa: {
          nativeResponse: {
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
