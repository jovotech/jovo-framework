import { Headers, JovoRequest, QueryParams, Server } from '..';

export class TestServer extends Server {
  constructor(private readonly request: JovoRequest) {
    super();
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  getRequestObject(): JovoRequest {
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
    // eslint-disable-next-line no-console
    console.error('TestServer.fail:');
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
