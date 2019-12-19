import { IncomingMessage, ServerResponse } from 'http';
import { Host } from 'jovo-core';
import * as url from 'url';

/**
 * Jovo Host implemented using the nodejs http package https://nodejs.org/api/http.html.
 * this is also compatible with Google's AppEngine.
 */
export default class HttpHost implements Host {
  hasWriteFileAccess = true;
  $request: any; // tslint:disable-line
  req: IncomingMessage;
  res: ServerResponse;
  headers: Record<string, any>; // tslint:disable-line

  constructor(req: IncomingMessage, body: string, res: ServerResponse) {
    this.req = req;
    this.res = res;
    this.headers = req.headers;

    try {
      this.$request = JSON.parse(body);
    } catch (e) {
      // failed to parse the request body. Send an error back.
      this.fail(e);
    }
  }

  getQueryParams(): Record<string, string> {
    const queryData = url.parse(this.req.url!, true).query;
    return (queryData as Record<string, string>) || {};
  }

  getRequestObject() {
    return this.$request;
  }

  setResponse(obj: any): Promise<void> {
    return new Promise((resolve, reject) => {
      // the promise will get resolved once the callback is called.
      this.res.setHeader('Content-Type', 'application/json; charset=utf8');
      this.res.end(JSON.stringify(obj), resolve);
    });
  }

  // called when an error occurs
  fail(error: Error) {
    if (this.res.headersSent === false) {
      this.res.setHeader('Content-Type', 'application/json; charset=utf8');
      this.res.end(
        JSON.stringify({
          code: 500,
          msg: error.message,
        }),
      );
    }
  }
}
