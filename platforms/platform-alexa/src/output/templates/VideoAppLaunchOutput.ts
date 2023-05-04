import { Output, BaseOutput, OutputTemplate, OutputOptions } from '@jovotech/framework';
import { VideoAppLaunchDirective } from '../models';

interface VideoAppLaunchOutputOptions extends OutputOptions {
  videoItem: VideoAppLaunchDirective['videoItem'];
}

@Output()
export class VideoAppLaunchOutput extends BaseOutput<VideoAppLaunchOutputOptions> {
  async build(): Promise<OutputTemplate> {
    const videoAppLaunchDirective: VideoAppLaunchDirective = {
      type: 'VideoApp.Launch',
      videoItem: this.options.videoItem,
    };

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              directives: [videoAppLaunchDirective],
              shouldEndSession: undefined,
            },
          },
        },
      },
    };
  }
}
