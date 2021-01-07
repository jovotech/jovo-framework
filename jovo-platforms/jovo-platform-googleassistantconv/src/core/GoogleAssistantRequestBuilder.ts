import { Inputs, RequestBuilder } from 'jovo-core';
import { ConversationalActionRequest } from './ConversationalActionRequest';
import * as path from 'path';
const samples: { [key: string]: string } = {
  LaunchRequest: './../../sample-request-json/LAUNCH.json',
  IntentRequest: './../../sample-request-json/IntentRequest.json',
  EndRequest: './../../sample-request-json/EndRequest.json',
};

export class GoogleAssistantRequestBuilder implements RequestBuilder<ConversationalActionRequest> {
  type = 'GoogleAction';

  async launch(json?: object): Promise<ConversationalActionRequest> {
    // tslint:disable-line
    return await this.launchRequest(json);
  }
  async intent(json?: object): Promise<ConversationalActionRequest>; // tslint:disable-line
  async intent(name?: string, inputs?: any): Promise<ConversationalActionRequest>; // tslint:disable-line
  // tslint:disable-next-line
  async intent(obj?: any, inputs?: any): Promise<ConversationalActionRequest> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();
      req.setIntentName(obj);
      const jovoInputs: Inputs = {};
      if (inputs) {
        for (const [key, value] of Object.entries(inputs)) {
          jovoInputs[key] = {
            value,
          };
        }
      }
      req.setInputs(jovoInputs);
      return req;
    } else {
      return await this.intentRequest(obj);
    }
  }

  async launchRequest(json?: object): Promise<ConversationalActionRequest> {
    //tslint:disable-line
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }
  async intentRequest(json?: object): Promise<ConversationalActionRequest> {
    // tslint:disable-line
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }

  async rawRequest(json: object) {
    // tslint:disable-line
    return ConversationalActionRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string) {
    const request = JSON.stringify(require(getJsonFilePath(key)));
    return ConversationalActionRequest.fromJSON(JSON.parse(request));
  }

  async audioPlayerRequest(json?: object) {
    // tslint:disable-line
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
      return ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }
  /**
   * End
   * @param {object|string} json
   * @return {SessionEndedRequest}
   */
  // tslint:disable-next-line
  async end(json?: any) {
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
      return ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }
}
function getJsonFilePath(key: string, version = 'v1'): string {
  let folder = './../../../';

  if (process.env.NODE_ENV === 'UNIT_TEST') {
    folder = './../../';
  }

  const fileName = samples[key];

  if (!fileName) {
    throw new Error(`${key} Can't find file.`);
  }

  return path.join(folder, 'sample-request-json', version, fileName);
}
