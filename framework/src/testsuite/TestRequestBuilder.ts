import { UnknownObject } from '@jovotech/framework';
import _merge from 'lodash.merge';
import { RequestBuilder, TestPlatform } from '..';
import { TestRequest } from './TestRequest';

export class TestRequestBuilder extends RequestBuilder<TestPlatform> {
  launch(json?: UnknownObject): TestRequest {
    const request: TestRequest = new TestRequest();

    return _merge(request, json);
  }

  intent(name?: string): TestRequest;
  intent(json?: UnknownObject): TestRequest;
  intent(nameOrJson?: string | UnknownObject): TestRequest {
    const request: TestRequest = new TestRequest();
    request.session.isNew = false;

    if (typeof nameOrJson !== 'undefined') {
      if (typeof nameOrJson === 'object') {
        return _merge(request, nameOrJson);
      } else {
        request.setIntent(nameOrJson);
      }
    }

    return request;
  }
}
