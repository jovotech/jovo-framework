import { Headers, QueryParams, Server } from '@jovotech/framework';

export class MockServer extends Server {
  constructor(readonly req: any) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  async setResponse(response: any): Promise<void> {
    return;
  }

  setResponseHeaders(header: Record<string, string>): void {
    return;
  }
}
