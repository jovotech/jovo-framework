import {
  Listen,
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

    let mergedListen: ListenValue = true;

    output.forEach((outputItem) => {
      const canSetListenObject =
        outputItem.listen !== false && typeof outputItem === 'object' && outputItem;
      const canSetListenRest =
        outputItem.listen !== false &&
        !(typeof outputItem.listen === 'object' && outputItem.listen) &&
        typeof outputItem !== 'undefined';

      if (outputItem.listen === false) {
        mergedListen = false;
      } else if (canSetListenObject) {
        mergedListen = { ...(outputItem.listen as Listen) };
      } else if (canSetListenRest) {
        mergedListen = outputItem.listen as boolean;
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
