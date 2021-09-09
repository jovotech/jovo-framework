import { SingleResponseOutputTemplateConverterStrategy } from '@jovotech/output';
import { OutputTemplate } from '..';
import { TestResponse } from './TestResponse';

export class TestOutputConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  TestResponse,
  any
> {
  protected sanitizeOutput(output: OutputTemplate): OutputTemplate {
    throw new Error('Method not implemented.');
  }
  toResponse(output: OutputTemplate): TestResponse {
    throw new Error('Method not implemented.');
  }
  readonly responseClass = TestResponse;

  platformName = 'testPlatform';

  buildResponse(output: OutputTemplate): TestResponse {
    // TODO: new TestResponse()?
    return {
      isTestResponse: true,
      shouldEndSession: !output.listen,
      hasSessionEnded() {
        return !!this.shouldEndSession;
      },
    };
  }

  fromResponse(response: TestResponse): OutputTemplate {
    return {};
  }
}
