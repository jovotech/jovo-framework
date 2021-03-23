// TODO implement
export abstract class Server {
  /**
     Returns whether the host can write files.
     **/
  abstract hasWriteFileAccess(): boolean; // e.g. false on Lambda

  /**
     Returns request object
     **/
  abstract getRequest(): unknown;

  /**
     Returns query params
     **/
  abstract getQueryParams(): Record<string, string>;

  /**
     Returns request headers
     **/
  abstract getRequestHeaders(): Record<string, string>;

  /**
     Sets additional response headers. Will be merged with existing
     **/
  abstract setResponseHeaders(header: Record<string, string>): void;

  /**
     Sets response object
     **/
  abstract setResponse(response: any): void;

  /**
     Calls fail method of server
     **/
  abstract fail(error: Error): void;
}
