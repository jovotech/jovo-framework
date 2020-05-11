import * as path from 'path';
import { RequestBuilder, Inputs } from 'jovo-core';
import { Lindenbaum } from '../Lindenbaum';
import {
  LindenbaumRequest,
  LindenbaumSessionRequestJSON,
  LindenbaumMessageRequestJSON,
  LindenbaumTerminatedRequestJSON,
  LindenbaumRequestJSON,
} from './LindenbaumRequest';

export class LindenbaumRequestBuilder implements RequestBuilder<LindenbaumRequest> {
  type = Lindenbaum.appType;

  async launch(json?: LindenbaumSessionRequestJSON): Promise<LindenbaumRequest> {
    return await this.launchRequest(json);
  }

  async intent(json?: object): Promise<LindenbaumRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, slots?: any): Promise<LindenbaumRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: Inputs): Promise<LindenbaumRequest> {
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
      return await this.intentRequest(obj);
    }
  }

  async launchRequest(json?: LindenbaumSessionRequestJSON): Promise<LindenbaumRequest> {
    if (json) {
      return LindenbaumRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return LindenbaumRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setUserId(randomUserId());
    }
  }

  async intentRequest(json?: LindenbaumMessageRequestJSON): Promise<LindenbaumRequest> {
    if (json) {
      return LindenbaumRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return LindenbaumRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setUserId(randomUserId());
    }
  }

  async end(json?: LindenbaumTerminatedRequestJSON): Promise<LindenbaumRequest> {
    if (json) {
      return LindenbaumRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
      return LindenbaumRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setUserId(randomUserId());
    }
  }

  /**
   * Autopilot doesn't have audio player requests
   */
  async audioPlayerRequest(json?: object): Promise<LindenbaumRequest> {
    return await this.intentRequest();
  }

  async rawRequest(json: LindenbaumRequestJSON): Promise<LindenbaumRequest> {
    return LindenbaumRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<LindenbaumRequest> {
    const req = JSON.stringify(require(getJsonFilePath(key)));
    return LindenbaumRequest.fromJSON(JSON.parse(req));
  }
}

const samples: { [key: string]: string } = {
  LaunchRequest: 'LaunchRequest.json',
  IntentRequest: 'IntentRequest.json',
  EndRequest: 'EndRequest.json',
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
