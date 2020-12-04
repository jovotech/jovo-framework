import { JovoResponse } from 'jovo-core';
import { CorePlatformResponse, CorePlatformResponseJSON } from 'jovo-platform-core';

export class WebAppResponse extends CorePlatformResponse implements JovoResponse {
  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? WebAppResponse.fromJSON(value) : value;
  }

  static fromJSON(json: CorePlatformResponseJSON | string): WebAppResponse {
    if (typeof json === 'string') {
      return JSON.parse(json, WebAppResponse.reviver);
    } else {
      const response = Object.create(WebAppResponse.prototype);
      return Object.assign(response, json);
    }
  }

  constructor() {
    super();
    this.version = '3.2.5';
  }
}
