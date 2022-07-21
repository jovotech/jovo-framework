import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export type CanFulfillResponse = 'YES' | 'NO' | 'MAYBE';

export interface CanFulfillIntentOutputSlotOptions {
  canUnderstand?: CanFulfillResponse;
  canFulfill?: CanFulfillResponse;
}

export interface CanFulfillIntentOutputOptions extends OutputOptions {
  canFulfill: CanFulfillResponse;
  slots?: Record<string, CanFulfillIntentOutputSlotOptions>;
}

@Output()
export class CanFulfillIntentOutput extends BaseOutput<CanFulfillIntentOutputOptions> {
  build(): OutputTemplate {
    return {
      listen: false,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              canFulfillIntent: {
                canFulfill: this.options.canFulfill,
                slots: this.options.slots ?? {},
              },
            },
          },
        },
      },
    };
  }
}
