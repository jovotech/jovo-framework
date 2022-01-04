import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ClearBehavior, ClearBehaviorLike } from '../models';

export interface AudioPlayerClearQueueOutputOptions extends OutputOptions {
  clearBehavior?: ClearBehaviorLike;
}

@Output()
export class AudioPlayerClearQueueOutput extends BaseOutput<AudioPlayerClearQueueOutputOptions> {
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
                  type: 'AudioPlayer.ClearQueue',
                  clearBehavior: this.options.clearBehavior || ClearBehavior.All,
                },
              ],
            },
          },
        },
      },
    };
  }
}
