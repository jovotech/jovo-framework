import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AudioItem, PlayBehavior, PlayBehaviorLike } from '../models';
import _merge from 'lodash.merge';

export interface AudioPlayerPlayOutputOptions extends OutputOptions {
  playBehavior?: PlayBehaviorLike;
  audioItem?: AudioItem;
}

@Output()
export class AudioPlayerPlayOutput extends BaseOutput<AudioPlayerPlayOutputOptions> {
  getDefaultOptions(): AudioPlayerPlayOutputOptions {
    return {
      playBehavior: PlayBehavior.ReplaceAll,
      audioItem: {
        stream: {
          url: '',
          token: '',
          offsetInMilliseconds: 0,
        },
      },
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    if (this.options.audioItem) {
      this.options.audioItem.stream.offsetInMilliseconds =
        this.options.audioItem.stream.offsetInMilliseconds || 0;
      this.options.audioItem.stream.token =
        this.options.audioItem.stream.token ||
        this.options.audioItem.stream.url.substring(
          this.options.audioItem.stream.url.lastIndexOf('/') + 1,
        );
    }

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: true,
              directives: [
                {
                  type: 'AudioPlayer.Play',
                  playBehavior: this.options.playBehavior,
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
