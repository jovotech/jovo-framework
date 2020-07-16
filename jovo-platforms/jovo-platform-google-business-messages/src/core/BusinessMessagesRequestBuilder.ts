import { Inputs, Log, RequestBuilder, Util } from 'jovo-core';
import * as path from 'path';

import { BusinessMessages } from '../BusinessMessages';
import { BusinessMessagesBaseRequest } from '../Interfaces';
import { BusinessMessagesRequest } from './BusinessMessagesRequest';

export class BusinessMessagesRequestBuilder implements RequestBuilder<BusinessMessagesRequest> {
  type = BusinessMessages.appType;

  async launch(json?: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    return this.launchRequest(json);
  }

  async intent(json?: object): Promise<BusinessMessagesRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, slots?: any): Promise<BusinessMessagesRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: Inputs): Promise<BusinessMessagesRequest> {
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

  async launchRequest(json?: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    return this.intentRequest(json);
  }

  async intentRequest(json?: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    if (json) {
      return BusinessMessagesRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return BusinessMessagesRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setSessionId(Util.randomStr(12));
    }
  }

  async end(json?: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    Log.warn(
      "Google Business Messages doesn't have a separate request type marking the end of a session.",
    );
    return this.intentRequest(json);
  }

  async audioPlayerRequest(json?: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    Log.warn("Google Business Messages doesn't have audio player requests.");
    return this.intentRequest(json);
  }

  async rawRequest(json: BusinessMessagesBaseRequest): Promise<BusinessMessagesRequest> {
    return BusinessMessagesRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<BusinessMessagesRequest> {
    const req = JSON.stringify(require(getJsonFilePath(key)));
    return BusinessMessagesRequest.fromJSON(JSON.parse(req));
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
