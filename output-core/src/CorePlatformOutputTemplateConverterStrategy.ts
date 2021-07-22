import { mergeInstances, OutputTemplate, OutputTemplateConverterStrategy } from '@jovotech/output';
import { CorePlatformResponse } from './models';

export class CorePlatformOutputTemplateConverterStrategy
  implements OutputTemplateConverterStrategy<CorePlatformResponse>
{
  responseClass = CorePlatformResponse;

  toResponse(output: OutputTemplate | OutputTemplate[]): CorePlatformResponse {
    output = Array.isArray(output) ? output : [output];
    const response: CorePlatformResponse = {
      version: '4.0.0',
      type: 'jovo-platform-core',
      output,
      session: {
        end: false,
        data: {},
      },
      context: {
        request: {},
      },
    };
    // TODO check listen-condition
    let lastListen: boolean | undefined;
    output.forEach((outputItem) => {
      const listen = outputItem.platforms?.CorePlatform?.listen ?? outputItem.listen;
      if (typeof listen === 'boolean') {
        lastListen = listen;
      }
      if (outputItem.platforms?.CorePlatform?.nativeResponse) {
        mergeInstances(response, outputItem.platforms.CorePlatform.nativeResponse);
      }
    });
    response.session.end = !lastListen;
    return response;
  }

  fromResponse(response: CorePlatformResponse): OutputTemplate[] {
    return response.output;
  }
}
