import { BaseApp, HandleRequest } from 'jovo-core';

export class MockHandleRequest extends HandleRequest {
  constructor() {
    super(new BaseApp(), {
      $request: {},
      hasWriteFileAccess: true,
      headers: {},
      getRequestObject() {
        // do nothing
      },
      getQueryParams() {
        return {};
      },
      setResponse() {
        return new Promise((res, rej) => {
          // do nothing
        });
      },
      fail() {
        // do nothing
      },
    });
  }
}
