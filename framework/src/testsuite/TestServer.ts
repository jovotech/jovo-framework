import { Headers, JovoRequest, QueryParams, Server } from '..';

export class TestServer extends Server {
  constructor(private readonly request: JovoRequest) {
    super();
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  getRequestObject(): Record<string, any> {
    return this.request;
  }

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestHeaders(): Headers {
    return { 'jovo-test': 'TestServer' };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setResponseHeaders(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async setResponse(): Promise<void> {}

  fail(error: Error): void {
    console.error('TestServer.fail:');
    console.error(error);
  }
}
