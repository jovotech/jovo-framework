import {
  ListenValue,
  mergeInstances,
  OutputTemplate,
  OutputTemplateConverterStrategy,
} from '@jovotech/output';
import { OutputTemplateConverterStrategyConfig } from '@jovotech/output/src';
import { CorePlatformResponse } from './models';

export class CoreOutputTemplateConverterStrategy extends OutputTemplateConverterStrategy<
  CorePlatformResponse,
  OutputTemplateConverterStrategyConfig
> {
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
    let lastListen: ListenValue | undefined;
    output.forEach((outputItem) => {
      const listen = outputItem.platforms?.CorePlatform?.listen ?? outputItem.listen;
      if (typeof listen === 'boolean' || typeof listen === 'object') {
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
