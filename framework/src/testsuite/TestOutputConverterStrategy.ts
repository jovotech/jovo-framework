import {
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { Constructor, OutputTemplate } from '..';
import { TestResponse } from './TestResponse';

export class TestOutputConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  TestResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly responseClass: Constructor<TestResponse> = TestResponse;
  readonly platformName: string = 'testPlatform';

  protected sanitizeOutput(output: OutputTemplate): OutputTemplate {
    return output;
  }

  toResponse(output: OutputTemplate): TestResponse {
    const response: TestResponse = this.prepareResponse({
      isTestResponse: true,
    });

    if (typeof output.listen == 'undefined') {
      response.shouldEndSession = !output.listen;
    }

    return response;
  }

  fromResponse(): OutputTemplate {
    return {};
  }
}
