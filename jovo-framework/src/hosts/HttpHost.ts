import * as http from 'http';
import { Host } from 'jovo-core';

/**
 * Jovo Host implemented using the nodejs http package https://nodejs.org/api/http.html.
 * this is also compatible with Google's AppEngine.
 */
export default class HttpHost implements Host {
  hasWriteFileAccess = true;
  $request: any; // tslint:disable-line
  req: http.IncomingMessage;
  res: http.ServerResponse;
  headers: any; // tslint:disable-line

  constructor(req: http.IncomingMessage, body: string, res: http.ServerResponse) {
    this.req = req;
    this.res = res;
    this.headers = req.headers;

    try {
      this.$request = JSON.parse(body);
    } catch (e) { // failed to parse the request body. Send an error back.
      this.fail(e);
    }
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
      this.res.end(JSON.stringify({
        code: 500,
        msg: error.message,
      }));
    }
  }
}