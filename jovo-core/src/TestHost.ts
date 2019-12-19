import { Host } from './Interfaces';
import { Log } from './util/Log';

export class TestHost implements Host {
  headers: { [key: string]: string };
  hasWriteFileAccess = true; // tests shouldn't write to filesystem
  req: any; // tslint:disable-line:no-any
  $request: any; // tslint:disable-line:no-any
  res: any; // tslint:disable-line:no-any
  err: Error | undefined;
  failed = false;

  constructor(req: any) {
    // tslint:disable-line:no-any
    this.headers = { 'jovo-test': 'TestHost' };
    this.req = req;
    this.$request = req;
  }

  /**
   * Full request object
   * @returns {any}
   */
  getRequestObject(): any {
    // tslint:disable-line:no-any
    return this.$request;
  }

  /**
   * Save the response
   * @param obj
   * @returns {Promise<any>}
   */
  setResponse(obj: any) {
    // tslint:disable-line:no-any
    return new Promise<void>((resolve) => {
      this.res = obj;
      resolve();
    });
  }

  getQueryParams(): Record<string, string> {
    return this.res.query || {};
  }

  /**
   * Return the previously set response object
   */
  getResponse(): any {
    // tslint:disable-line:no-any
    return this.res;
  }

  /**
   * Save the error and set failed flag
   * @param error
   */
  fail(error: Error) {
    Log.error('TestHost.fail: ');
    Log.error(error);
    this.err = error;
    this.failed = true;
  }

  /**
   * Return the previously set error
   * @returns Error
   */
  getError(): Error {
    return this.err!;
  }

  /**
   * Returns true if an error occurred while handling the request
   */
  didFail(): boolean {
    return this.failed;
  }
}
