import {
  ListenValue,
  mergeInstances,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
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
    const response: CoreResponse = {
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
    };
    let mergedListen: ListenValue | undefined;
    output.forEach((outputItem) => {
      const listen = outputItem.listen ?? true;

      // if listen is an object and not null
      if (typeof listen === 'object' && listen) {
        mergedListen = { ...listen };
        // if merged listen is not an object
      } else if (typeof mergedListen !== 'object') {
        mergedListen = listen;
      }

      if (outputItem.platforms?.core?.nativeResponse) {
        mergeInstances(response, outputItem.platforms.core.nativeResponse);
      }
    });
    response.context.session.end = !mergedListen;
    return response;
  }

  fromResponse(response: CoreResponse): OutputTemplate[] {
    return response.output;
  }
}
