import { RequestBuilder, TestPlatform } from '..';
import { TestRequest } from './TestRequest';

export class TestRequestBuilder extends RequestBuilder<TestPlatform> {
  launch(): TestRequest {
    return new TestRequest();
  }

  intent(name?: string): TestRequest;
  intent(json?: Record<string, unknown>): TestRequest;
  intent(): TestRequest {
    return new TestRequest();
  }
}
