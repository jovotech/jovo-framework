import { AnyObject, Headers, QueryParams, Server } from '@jovotech/framework';

export interface MockServerRequest {
  data: AnyObject;
  headers?: Headers;
  params?: QueryParams;
}

export class MockServer extends Server {
  constructor(readonly req: MockServerRequest) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  fail(error: Error): void {}

  getQueryParams(): QueryParams {
    return this.req.params || {};
  }

  getNativeRequestHeaders(): Headers {
    return this.req.headers || {};
  }

  getRequestObject(): Record<string, string> {
    return this.req.data;
  }

  hasWriteFileAccess(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setResponse(response: AnyObject): Promise<void> {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setResponseHeaders(header: Record<string, string>): void {
    return;
  }
}
