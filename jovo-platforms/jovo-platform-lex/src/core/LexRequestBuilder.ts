import * as path from 'path';

import { RequestBuilder } from 'jovo-core';
import { LexRequest, LexInputs } from './LexRequest';

const samples: { [key: string]: string } = {
  LaunchRequest: 'LaunchRequest.json',
  IntentRequest: 'IntentRequest.json',
  EndRequest: 'EndRequest.json',
};

export class LexRequestBuilder implements RequestBuilder<LexRequest> {
  type = 'LexBot';

  async launch(json?: object): Promise<LexRequest> {
    return await this.launchRequest(json);
  }

  async intent(json?: object): Promise<LexRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, slots?: any): Promise<LexRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: LexInputs): Promise<LexRequest> {
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

  async launchRequest(json?: object): Promise<LexRequest> {
    if (json) {
      return LexRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return LexRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
    }
  }
  async intentRequest(json?: object): Promise<LexRequest> {
    if (json) {
      return LexRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return LexRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setUserId(getRandomUserId());
    }
  }

  /**
   * Lex doesn't have audio player requests
   */
  async audioPlayerRequest(json?: object): Promise<LexRequest> {
    return await this.intentRequest();
  }

  async end(json?: object): Promise<LexRequest> {
    if (json) {
      return LexRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
      return LexRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setUserId(getRandomUserId());
    }
  }

  async rawRequest(json: object): Promise<LexRequest> {
    return LexRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<LexRequest> {
    const req = JSON.stringify(require(getJsonFilePath(key)));
    return LexRequest.fromJSON(JSON.parse(req));
  }
}

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

/**
 * Generates a random string [a-z][A-Z][0-9] with `length` number of characters.
 * @param {number} length
 */
function generateRandomString(length: number) {
  let randomString = '';
  const stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));
  }

  return randomString;
}

function getRandomUserId() {
  return (
    'user-' +
    Math.random().toString(36).substring(5) +
    '-' +
    Math.random().toString(36).substring(2)
  );
}
