import {
  ListenValue,
  mergeInstances,
  mergeListen,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
} from '@jovotech/output';
import { CoreResponse } from '../CoreResponse';

export class CoreOutputTemplateConverterStrategy extends OutputTemplateConverterStrategy<
  CoreResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = CoreResponse;
  platformName: 'core' | string = 'core';

  toResponse(output: NormalizedOutputTemplate | NormalizedOutputTemplate[]): CoreResponse {
    output = Array.isArray(output) ? output : [output];
    const response: CoreResponse = this.normalizeResponse({
      version: '4.0.0',
      platform: 'core',
      output,
      context: {
        request: {},
        session: {
          end: false,
          data: {},
        },
        user: {
          data: {},
        },
      },
    }) as CoreResponse;

    let mergedListen: ListenValue | undefined | null;
    output.forEach((outputItem) => {
      mergedListen = mergeListen(mergedListen, outputItem.listen);
      if (outputItem.platforms?.core?.nativeResponse) {
        mergeInstances(response, outputItem.platforms.core.nativeResponse);
      }
    });
    response.context.session.end = !(mergedListen ?? true);
    return response;
  }

  fromResponse(response: CoreResponse): NormalizedOutputTemplate[] {
    return response.output;
  }
}
