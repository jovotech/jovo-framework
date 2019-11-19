import { RequestBuilder } from 'jovo-core';
import * as path from 'path';
import { MessengerBotRequest } from './MessengerBotRequest';

const samples: Record<string, string> = {
  IntentRequest: 'IntentRequest.json',
  LaunchRequest: 'LaunchRequest.json',
};

export class FacebookMessengerRequestBuilder implements RequestBuilder<MessengerBotRequest> {
  type = 'MessengerBot';

  // not supported
  async audioPlayerRequest(json?: object): Promise<MessengerBotRequest> {
    return new MessengerBotRequest();
  }

  // not supported
  async end(json?: object): Promise<MessengerBotRequest> {
    return new MessengerBotRequest();
  }

  async intent(json?: object): Promise<MessengerBotRequest>;
  async intent(name?: string, slots?: any): Promise<MessengerBotRequest>;
  async intent(json?: object | string, slots?: any): Promise<MessengerBotRequest> {
    if (typeof json === 'string') {
      const req = await this.intentRequest();
      req.setIntentName(json);
      return req;
    }
    return this.intentRequest(json);
  }

  async intentRequest(json?: object): Promise<MessengerBotRequest> {
    if (json) {
      return MessengerBotRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
      return MessengerBotRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }

  async launch(json?: object): Promise<MessengerBotRequest> {
    return this.launchRequest(json);
  }

  async launchRequest(json?: object): Promise<MessengerBotRequest> {
    if (json) {
      return MessengerBotRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
      return MessengerBotRequest.fromJSON(JSON.parse(request)).setTimestamp(
        new Date().toISOString(),
      );
    }
  }

  async rawRequest(json: object): Promise<MessengerBotRequest> {
    return MessengerBotRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<MessengerBotRequest> {
    const request = JSON.stringify(require(getJsonFilePath(key)));
    return MessengerBotRequest.fromJSON(JSON.parse(request));
  }
}

function getJsonFilePath(key: string, version = 'v1'): string {
  let folder = './../../../';

  if (process.env.NODE_ENV === 'UNIT_TEST') {
    folder = './../../';
  }

  const fileName = samples[key];

  if (!fileName) {
    throw new Error(`Can't find file.`);
  }

  return path.join(folder, 'sample-request-json', version, fileName);
}
