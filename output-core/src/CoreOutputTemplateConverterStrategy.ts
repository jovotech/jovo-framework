import {
  ListenValue,
  mergeInstances,
  MultipleResponsesOutputTemplateConverterStrategy,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { CoreResponse } from './models';

export class CoreOutputTemplateConverterStrategy extends OutputTemplateConverterStrategy<
  CoreResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = CoreResponse;
  platformName = 'core' as const;

  toResponse(output: OutputTemplate | OutputTemplate[]): CoreResponse {
    output = Array.isArray(output) ? output : [output];
    const response: CoreResponse = this.prepareResponse({
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
    let lastListen: ListenValue | undefined;
    output.forEach((outputItem) => {
      const listen = outputItem.platforms?.core?.listen ?? outputItem.listen;
      if (typeof listen === 'boolean' || typeof listen === 'object') {
        lastListen = listen;
      }
      if (outputItem.platforms?.core?.nativeResponse) {
        mergeInstances(response, outputItem.platforms.core.nativeResponse);
      }
    });
    response.context.session.end = !lastListen;
    return response;
  }

  fromResponse(response: CoreResponse): OutputTemplate[] {
    return response.output;
  }
}
