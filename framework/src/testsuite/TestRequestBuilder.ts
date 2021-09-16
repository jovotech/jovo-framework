import _merge from 'lodash.merge';
import { RequestBuilder, TestPlatform, UnknownObject } from '..';
import { TestRequest } from './TestRequest';

export class TestRequestBuilder extends RequestBuilder<TestPlatform> {
  launch(json?: UnknownObject): TestRequest {
    const request: TestRequest = new TestRequest();

    return _merge(request, json);
  }

  intent(name?: string): TestRequest;
  intent(json?: Record<string, unknown>): TestRequest;
  intent(nameOrJson?: string | UnknownObject): TestRequest {
    const request: TestRequest = new TestRequest();
    if (typeof nameOrJson === 'object') {
      return _merge(request, nameOrJson);
    }
    return request;
  }
}
