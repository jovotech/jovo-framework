import { Inputs, Log, RequestBuilder, Util } from 'jovo-core';
import * as path from 'path';

import { GoogleBusiness } from '../GoogleBusiness';
import { GoogleBusinessBaseRequest } from '../Interfaces';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessRequestBuilder implements RequestBuilder<GoogleBusinessRequest> {
  type = GoogleBusiness.appType;

  async launch(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    return this.launchRequest(json);
  }

  async intent(json?: object): Promise<GoogleBusinessRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, slots?: any): Promise<GoogleBusinessRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: Inputs): Promise<GoogleBusinessRequest> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();
      req.setIntentName(obj);
      if (inputs) {
        for (const slot in inputs) {
          if (inputs.hasOwnProperty(slot)) {
            req.addInput(slot, inputs[slot]);
          }
        }
      }
      return req;
    } else {
      return this.intentRequest(obj);
    }
  }

  async launchRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    return this.intentRequest(json);
  }

  async intentRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    if (json) {
      return GoogleBusinessRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return GoogleBusinessRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setSessionId(Util.randomStr(12));
    }
  }

  async end(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    Log.warn(
      'Google Business Messages doesn\'t have a separate request type marking the end of a session.',
    );
    return this.intentRequest(json);
  }

  async audioPlayerRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    Log.warn('Google Business Messages doesn\'t have audio player requests.');
    return this.intentRequest(json);
  }

  async rawRequest(json: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest> {
    return GoogleBusinessRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<GoogleBusinessRequest> {
    const req = JSON.stringify(require(getJsonFilePath(key)));
    return GoogleBusinessRequest.fromJSON(JSON.parse(req));
  }
}

const samples: { [key: string]: string } = {
  IntentRequest: 'IntentRequest.json',
};

function getJsonFilePath(key: string): string {
  let folder = './../../../';

  if (process.env.NODE_ENV === 'UNIT_TEST') {
    folder = './../../';
  }

  const fileName = samples[key];

  if (!fileName) {
    throw new Error(`Can't find file.`);
  }

  return path.join(folder, 'sample-request-json', fileName);
}

const randomUserId = () => {
  return (
    'user-' +
    Math.random().toString(36).substring(5) +
    '-' +
    Math.random().toString(36).substring(2)
  );
};
