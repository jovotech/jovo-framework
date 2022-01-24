import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AudioItem, PlayBehavior, PlayBehaviorLike } from '../models';

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
      // Sets value for offsetInMilliseconds to 0, if it's not set in options by the developer.
      // Otherwise the directive payload would be invalid
      this.options.audioItem.stream.offsetInMilliseconds =
        this.options.audioItem.stream.offsetInMilliseconds || 0;

      // Sets the file name as token, if it's not set in options by the developer.
      // https://example.com/fileXYZ.mp3 => token = fileXYZ.mp3
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
