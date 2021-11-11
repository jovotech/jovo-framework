import { Constructor } from '@jovotech/common';
import {
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { OutputTemplate } from '..';
import { TestResponse } from './TestResponse';

export class TestOutputConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  TestResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly responseClass: Constructor<TestResponse> = TestResponse;
  readonly platformName: string = 'testPlatform';

  protected sanitizeOutput(output: NormalizedOutputTemplate): NormalizedOutputTemplate {
    return output;
  }

  toResponse(output: NormalizedOutputTemplate): TestResponse {
    const response: TestResponse = this.normalizeResponse({
      isTestResponse: true,
    });

    if (typeof output.listen == 'undefined') {
      response.shouldEndSession = !output.listen;
    }

    return response;
  }

  fromResponse(): NormalizedOutputTemplate {
    return {};
  }
}
