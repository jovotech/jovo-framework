import { OutputTemplate, OutputTemplateConverterStrategy } from '@jovotech/output';
import _merge from 'lodash.merge';
import { CoreResponse } from './models';

export class CoreOutputTemplateConverterStrategy
  implements OutputTemplateConverterStrategy<CoreResponse> {
  responseClass = CoreResponse;

  toResponse(output: OutputTemplate | OutputTemplate[]): CoreResponse {
    output = Array.isArray(output) ? output : [output];
    // TODO check listen condition
    const listen =
      output[output.length - 1]?.platforms?.Core?.listen ??
      output[output.length - 1]?.listen ??
      false;
    const response: CoreResponse = {
      version: '',
      output,
      session: {
        end: !listen,
        data: {},
      },
      context: {
        request: {},
      },
    };

    output.forEach((outputItem) => {
      if (outputItem?.platforms?.Core?.nativeResponse) {
        _merge(response, outputItem.platforms.Core.nativeResponse);
      }
    });
    return response;
  }

  fromResponse(response: CoreResponse): OutputTemplate[] {
    return response.output;
  }
}
