import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AudioItem, PlayBehavior, PlayBehaviorLike } from '../models';

export interface AudioPlayerPlayOutputOptions extends OutputOptions {
  playBehavior?: PlayBehaviorLike;
  audioItem: AudioItem;
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
    // Sets the file name as token, if it's not set in options by the developer.
    // https://example.com/fileXYZ.mp3 => token = fileXYZ.mp3
    this.options.audioItem.stream.token =
      this.options.audioItem.stream.token ||
      AudioPlayerPlayOutput.getTokenFromUrl(this.options.audioItem.stream.url);

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

  static getTokenFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }
}
