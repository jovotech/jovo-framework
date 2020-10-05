import { RequestBuilder } from 'jovo-core';
import * as path from 'path';
import { CorePlatformRequest } from './CorePlatformRequest';

export interface CorePlatformRequestConstructor<T extends CorePlatformRequest> {
  new (): T;
  fromJSON(json: any): T;
  reviver(key: string, value: any): any;
}

export class CorePlatformRequestBuilder<REQ extends CorePlatformRequest = CorePlatformRequest>
  implements RequestBuilder<REQ> {
  type = 'CorePlatformApp';

  protected requestClass: CorePlatformRequestConstructor<
    REQ
  > = CorePlatformRequest as CorePlatformRequestConstructor<REQ>;

  async launch(json?: object): Promise<REQ> {
    return this.launchRequest(json);
  }

  async launchRequest(json?: object): Promise<REQ> {
    if (json) {
      return this.requestClass.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('LaunchRequest'));
      return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async intent(json?: object): Promise<REQ>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, inputs?: any): Promise<REQ>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: any): Promise<REQ> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();
      req.setIntentName(obj);
      if (inputs) {
        for (const input in inputs) {
          if (inputs.hasOwnProperty(input)) {
            req.addInput(input, inputs[input]);
          }
        }
      }
      return req;
    } else {
      return this.intentRequest(obj);
    }
  }

  async intentRequest(json?: object): Promise<REQ> {
    if (json) {
      return this.requestClass.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('IntentRequest'));
      return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async rawRequest(json: object): Promise<REQ> {
    return this.requestClass.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<REQ> {
    const req = JSON.stringify(this.loadJson(key));
    return this.requestClass.fromJSON(JSON.parse(req));
  }

  async audioPlayerRequest(json?: object): Promise<REQ> {
    if (json) {
      return this.requestClass.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('AudioPlayerRequest'));
      return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async end(json?: object): Promise<REQ> {
    if (json) {
      return this.requestClass.fromJSON(json);
    } else {
      const request = JSON.stringify(this.loadJson('SessionEndedRequest'));
      return this.requestClass.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }

  protected getJsonPath(key: string, version: string): string {
    let folder = './../../../';

    if (process.env.NODE_ENV === 'UNIT_TEST') {
      folder = './../../';
    }

    const fileName = `${key}.json`;

    if (!fileName) {
      throw new Error(`Can't find file.`);
    }

    return path.join(folder, 'sample-request-json', version, fileName);
  }

  // tslint:disable-next-line:no-any
  protected loadJson(key: string, version = 'v1'): any {
    return require(this.getJsonPath(key, version));
  }
}
