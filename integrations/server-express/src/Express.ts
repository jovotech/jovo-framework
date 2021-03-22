import { Server } from '@jovotech/framework';

export class Express extends Server {
  fail(error: Error): void {
    //
  }

  getQueryParams(): Record<string, string> {
    return {};
  }

  getRequest(): unknown {
    return undefined;
  }

  getRequestHeaders(): Record<string, string> {
    return {};
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  setResponse(response: any): void {}

  setResponseHeaders(header: Record<string, string>): void {}
}
