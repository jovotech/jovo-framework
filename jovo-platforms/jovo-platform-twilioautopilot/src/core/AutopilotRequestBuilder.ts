import * as path from 'path';

import { RequestBuilder } from 'jovo-core';
import { AutopilotRequest, AutopilotInputs } from './AutopilotRequest';

const samples: { [key: string]: string } = {
  LaunchRequest: 'LaunchRequest.json',
  IntentRequest: 'IntentRequest.json',
  EndRequest: 'EndRequest.json',
};

export class AutopilotRequestBuilder implements RequestBuilder<AutopilotRequest> {
  type = 'AutopilotBot';

  async launch(json?: object): Promise<AutopilotRequest> {
    return await this.launchRequest(json);
  }

  async intent(json?: object): Promise<AutopilotRequest>;
  // tslint:disable-next-line:no-any
  async intent(name?: string, slots?: any): Promise<AutopilotRequest>;
  // tslint:disable-next-line:no-any
  async intent(obj?: any, inputs?: AutopilotInputs): Promise<AutopilotRequest> {
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

  async launchRequest(json?: object): Promise<AutopilotRequest> {
    if (json) {
      return AutopilotRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return AutopilotRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setSessionId(generateRandomString(12));
    }
  }

  async intentRequest(json?: object): Promise<AutopilotRequest> {
    if (json) {
      return AutopilotRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return AutopilotRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setSessionId(generateRandomString(12));
    }
  }

  /**
   * Autopilot doesn't have audio player requests
   */
  async audioPlayerRequest(json?: object): Promise<AutopilotRequest> {
    return await this.intentRequest();
  }

  async end(json?: object): Promise<AutopilotRequest> {
    if (json) {
      return AutopilotRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
      return AutopilotRequest.fromJSON(JSON.parse(request))
        .setTimestamp(new Date().toISOString())
        .setSessionId(generateRandomString(12));
    }
  }

  async rawRequest(json: object): Promise<AutopilotRequest> {
    return AutopilotRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<AutopilotRequest> {
    const req = JSON.stringify(require(getJsonFilePath(key)));
    return AutopilotRequest.fromJSON(JSON.parse(req));
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
