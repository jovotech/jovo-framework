import { GoogleActionRequest } from './GoogleActionRequest';
import { RequestBuilder } from 'jovo-core';
const samples: { [key: string]: string } = {
  'LaunchRequest': './../../sample-request-json/v1/LaunchRequest.json',
  'IntentRequest1': './../../sample-request-json/v1/IntentRequest1.json',
  'Connections.Response': './../../sample-request-json/v1/Connections.Response.json',
  'AudioPlayer.PlaybackStarted': './../../sample-request-json/v1/AudioPlayer.PlaybackStarted.json',
};

export class GoogleAssistantRequestBuilder implements RequestBuilder<GoogleActionRequest> {
  type = 'GoogleAction';

  launch(json?: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    return this.launchRequest(json);
  }
  async intent(json?: object): Promise<GoogleActionRequest>; //tslint:disable-line
  async intent(name?: string, inputs?: any): Promise<GoogleActionRequest>; //tslint:disable-line
  // tslint:disable-next-line
  async intent(obj?: any, inputs?: any): Promise<GoogleActionRequest> {
    if (typeof obj === 'string') {
      const req = await this.intentRequest();

      return req;
    } else {
      return await this.intentRequest(obj);
    }
  }

  async launchRequest(json?: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    if (json) {
      return GoogleActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
      const request = JSON.stringify(require(samples['LaunchRequest']));
      return GoogleActionRequest.fromJSON(JSON.parse(request));
    }
  }
  async intentRequest(json?: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    if (json) {
      return GoogleActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
      const request = JSON.stringify(require(samples['IntentRequest1']));
      return GoogleActionRequest.fromJSON(JSON.parse(request));
    }
  }

  async rawRequest(json: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    return GoogleActionRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<GoogleActionRequest> {
    const request = JSON.stringify(require(samples[key]));
    return GoogleActionRequest.fromJSON(JSON.parse(request));
  }

  // TODO:
  async audioPlayerRequest(json?: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    if (json) {
      return GoogleActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
      const request = JSON.stringify(require(samples['IntentRequest1']));
      return GoogleActionRequest.fromJSON(JSON.parse(request));
    }
  }

  // TODO:
  async end(json?: object): Promise<GoogleActionRequest> {
    //tslint:disable-line
    if (json) {
      return GoogleActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
      const request = JSON.stringify(require(samples['IntentRequest1']));
      return GoogleActionRequest.fromJSON(JSON.parse(request));
    }
  }
}
