import { Headers, PlainObjectType, QueryParams, Server } from '../../src';
import { ExamplePlatformRequest, ExamplePlatformResponse } from './platform';

export class ExampleServer extends Server {
  response: PlainObjectType<ExamplePlatformResponse>;
  headers: Headers = {};
  constructor(readonly request: PlainObjectType<ExamplePlatformRequest>) {
    super();
    this.response = new ExamplePlatformResponse();
  }

  fail(error: Error): Promise<void> | void {
    this.response.error = error;
  }

  getNativeRequestHeaders(): Headers {
    return {};
  }

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestObject(): PlainObjectType<ExamplePlatformRequest> {
    return this.request;
  }

  hasWriteFileAccess(): boolean {
    return false;
  }

  async setResponse(response: PlainObjectType<ExamplePlatformResponse>): Promise<void> {
    this.response = response;
  }

  setResponseHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }
}
