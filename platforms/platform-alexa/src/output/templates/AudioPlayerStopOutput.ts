import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AudioItem, PlayBehavior, PlayBehaviorLike } from '../models';

@Output()
export class AudioPlayerStopOutput extends BaseOutput {
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
                  type: 'AudioPlayer.Stop',
                },
              ],
            },
          },
        },
      },
    };
  }
}
