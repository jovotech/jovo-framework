import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AudioItem, PlayBehavior, PlayBehaviorLike } from '../models';

export interface AudioPlayerPlayOutputOptions extends OutputOptions {
  playBehavior?: PlayBehaviorLike;
  audioItem?: AudioItem;
}

@Output()
export class AudioPlayerPlayOutput extends BaseOutput<AudioPlayerPlayOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: null,
              directives: [
                {
                  type: 'AudioPlayer.Play',
                  playBehavior: this.options.playBehavior || PlayBehavior.ReplaceAll,
                  audioItem: this.options.audioItem,
                },
              ],
            },
          },
        },
      },
    };
  }
}
