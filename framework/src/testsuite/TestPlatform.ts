import { Platform, ExtensibleConfig } from '..';
import { TestDevice } from './TestDevice';
import { TestJovo } from './TestJovo';
import { TestOutputConverterStrategy } from './TestOutputConverterStrategy';
import { TestRequest } from './TestRequest';
import { TestRequestBuilder } from './TestRequestBuilder';
import { TestResponse } from './TestResponse';
import { TestUser } from './TestUser';

export class TestPlatform extends Platform<
  TestRequest,
  TestResponse,
  TestJovo,
  TestUser,
  TestDevice,
  TestPlatform,
  ExtensibleConfig
> {
  readonly jovoClass = TestJovo;
  readonly requestClass = TestRequest;
  readonly outputTemplateConverterStrategy = new TestOutputConverterStrategy();
  readonly userClass = TestUser;
  readonly requestBuilder = TestRequestBuilder;
  readonly deviceClass = TestDevice;

  isRequestRelated(request: TestRequest): boolean {
    return request.isTestRequest;
  }

  finalizeResponse(response: TestResponse | TestResponse[]): TestResponse | TestResponse[] {
    return response;
  }

  isResponseRelated(): boolean {
    return true;
  }

  getDefaultConfig(): ExtensibleConfig {
    return {};
  }
}
