import { BaseApp, HandleRequest } from 'jovo-core';

export class MockHandleRequest extends HandleRequest {
  constructor() {
    super(new BaseApp(), {
      $request: {},
      hasWriteFileAccess: true,
      headers: {},
      getRequestObject() {
        // tslint:disable-line:no-empty
      },
      getQueryParams() {
        return {};
      },
      setResponse() {
        return new Promise((res, rej) => {
          // tslint:disable-line:no-empty
        });
      },
      fail() {
        // tslint:disable-line:no-empty
      },
    });
  }
}
