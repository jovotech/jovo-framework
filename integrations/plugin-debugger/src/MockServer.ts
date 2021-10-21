import { Headers, QueryParams, Server } from '@jovotech/framework';
import { AnyObject } from '@jovotech/framework';

export class MockServer extends Server {
  constructor(readonly req: AnyObject) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  fail(error: Error): void {}

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestHeaders(): Headers {
    return {};
  }

  getRequestObject(): Record<string, string> {
    return this.req;
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
