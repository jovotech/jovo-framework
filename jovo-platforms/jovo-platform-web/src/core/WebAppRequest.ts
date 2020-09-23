import { JovoRequest } from 'jovo-core';
import { CorePlatformRequest, CorePlatformRequestJSON } from 'jovo-platform-core';

export class WebAppRequest extends CorePlatformRequest implements JovoRequest {
  static fromJSON(json: CorePlatformRequestJSON | object | string): WebAppRequest {
    if (typeof json === 'string') {
      return JSON.parse(json, WebAppRequest.reviver);
    } else {
      const request = Object.create(WebAppRequest.prototype);
      return Object.assign(request, json);
    }
  }

  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? WebAppRequest.fromJSON(value) : value;
  }

  type = 'jovo-platform-web';
}
