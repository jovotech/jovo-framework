import { PlainObjectType } from '@jovotech/output';
import { Headers, QueryParams, Server, ServerResponse } from '../../src';
import { ExamplePlatformRequest } from './platform';

export class ExampleServer extends Server {
  response: ServerResponse;
  constructor(readonly request: PlainObjectType<ExamplePlatformRequest>) {
    super();
    this.response = {};
  }

  fail(error: Error): Promise<void> | void {
    this.response = error;
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

  async setResponse(response: ServerResponse): Promise<void> {
    this.response = response;
  }

  setResponseHeaders(header: Record<string, string>): void {}
}
