import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

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
