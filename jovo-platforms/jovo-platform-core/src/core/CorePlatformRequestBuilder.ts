import { RequestBuilder } from 'jovo-core';
import * as path from 'path';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformRequestBuilder implements RequestBuilder<CorePlatformRequest> {
  type = 'CorePlatformApp';

  async launch(json?: object): Promise<CorePlatformRequest> {
    return this.launchRequest(json);
  }

  async launchRequest(json?: object): Promise<CorePlatformRequest> {
    if (json) {
      return CorePlatformRequest.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('LaunchRequest'));
      return CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async intent(json?: object): Promise<CorePlatformRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, inputs?: any): Promise<CorePlatformRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: any): Promise<CorePlatformRequest> {
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

  async intentRequest(json?: object): Promise<CorePlatformRequest> {
    if (json) {
      return CorePlatformRequest.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('IntentRequest'));
      return CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async rawRequest(json: object): Promise<CorePlatformRequest> {
    return CorePlatformRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<CorePlatformRequest> {
    const req = JSON.stringify(this.loadJson(key));
    return CorePlatformRequest.fromJSON(JSON.parse(req));
  }

  async audioPlayerRequest(json?: object): Promise<CorePlatformRequest> {
    if (json) {
      return CorePlatformRequest.fromJSON(json);
    } else {
      const req = JSON.stringify(this.loadJson('AudioPlayerRequest'));
      return CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
    }
  }

  async end(json?: object): Promise<CorePlatformRequest> {
    if (json) {
      return CorePlatformRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(this.loadJson('SessionEndedRequest'));
      return CorePlatformRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }

  private getJsonPath(key: string, version: string): string {
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
  private loadJson(key: string, version = 'v1'): any {
    return require(this.getJsonPath(key, version));
  }
}
