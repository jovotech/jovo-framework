import _set = require('lodash.set');
import { RequestBuilder } from 'jovo-core';
import { DialogflowRequest, DialogflowRequestJSON } from './DialogflowRequest';
import * as path from 'path';
import { DialogflowFactory } from './DialogflowFactory';
import { PlatformFactory } from '../index';

const samples: { [key: string]: { [key: string]: string } | string } = {
  google: {
    DefaultWelcomeIntent: 'DefaultWelcomeIntent.json',
    HelpIntent: 'HelpIntent.json',
    MediaFinished: 'MediaFinished.json',
    Cancel: 'Cancel.json',
    SignInCancelled: 'SignInCancelled.json',
    SignInOk: 'SignInOk.json',
    RegisterUpdateCancelled: 'RegisterUpdateCancelled.json',
    RegisterUpdateOk: 'RegisterUpdateOk.json',
    OnPermissionName: 'OnPermissionName.json',
    OnPermissionPreciseLocation: 'OnPermissionPreciseLocation.json',
    OnPermissionNotification: 'OnPermissionNotification.json',
    CompletePurchase: 'CompletePurchase.json',
    OnPlace: 'OnPlace.json',
  },
  dialogflow: {
    DefaultWelcomeIntent: 'DefaultWelcomeIntent.json',
    HelpIntent: 'HelpIntent.json',
  },
};

type PlatformType = 'google' | 'facebook' | 'slack';

export class DialogflowRequestBuilder<T extends PlatformFactory = DialogflowFactory>
  implements RequestBuilder<DialogflowRequest> {
  type = 'DialogflowAgent';

  constructor(private factory: T) {}

  async launch(json?: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    return await this.launchRequest(json);
  }
  async intent(json?: object): Promise<DialogflowRequest>; // tslint:disable-line
  async intent(name?: string, inputs?: any): Promise<DialogflowRequest>; // tslint:disable-line
  // tslint:disable-next-line
  async intent(obj?: any, inputs?: any): Promise<DialogflowRequest> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();
      _set(req, `queryResult.intent.displayName`, obj);
      if (inputs) {
        for (const parameter in inputs) {
          if (inputs.hasOwnProperty(parameter)) {
            req.setParameter(parameter, inputs[parameter]);
          }
        }
      }
      return req;
    } else {
      return await this.intentRequest(obj);
    }
  }

  async launchRequest(json?: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    if (json) {
      return this.factory.createRequest(json) as DialogflowRequest;
    } else {
      const reqObj: any = getJsonFilePath('DefaultWelcomeIntent', this.factory.type()); // tslint:disable-line
      const request = JSON.stringify(require(reqObj));
      return this.factory.createRequest(request as DialogflowRequestJSON) as DialogflowRequest;
    }
  }

  async intentRequest(json?: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    if (json) {
      return this.factory.createRequest(json) as DialogflowRequest;
    } else {
      const reqObj: any = getJsonFilePath('HelpIntent', this.factory.type()); // tslint:disable-line
      const request = JSON.stringify(require(reqObj));
      return this.factory.createRequest(request as DialogflowRequestJSON) as DialogflowRequest;
    }
  }

  async rawRequest(json: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    return DialogflowRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<DialogflowRequest> {
    const reqObj: any = getJsonFilePath(key, this.factory.type()); // tslint:disable-line
    const request = JSON.stringify(require(reqObj));
    return this.factory.createRequest(request as DialogflowRequestJSON) as DialogflowRequest;
  }
  async audioPlayerRequest(json?: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    if (json) {
      return this.factory.createRequest(json) as DialogflowRequest;
    } else {
      const reqObj: any = getJsonFilePath('MediaFinished', this.factory.type()); // tslint:disable-line
      const request = JSON.stringify(require(reqObj));
      return this.factory.createRequest(request as DialogflowRequestJSON) as DialogflowRequest;
    }
  }
  async end(json?: object): Promise<DialogflowRequest> {
    // tslint:disable-line
    if (json) {
      return this.factory.createRequest(json) as DialogflowRequest;
    } else {
      const reqObj: any = getJsonFilePath('Cancel', this.factory.type()); // tslint:disable-line
      const request = JSON.stringify(require(reqObj));
      return this.factory.createRequest(request as DialogflowRequestJSON) as DialogflowRequest;
    }
  }

  async getPlatformRequest(key: string, platform: string) {
    return JSON.parse(JSON.stringify(require(getJsonFilePath(key, platform))));
  }
}
function getJsonFilePath(key: string, platform = 'google'): string {
  let folder = './../../../';

  if (process.env.NODE_ENV === 'UNIT_TEST') {
    folder = './../../../';
  }

  // @ts-ignore
  const fileName = samples[platform][key];

  if (!fileName) {
    throw new Error(`Can't find file.`);
  }

  return path.join(folder, 'sample-request-json', 'v2', platform, fileName);
}
