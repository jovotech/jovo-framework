import { Inputs, RequestBuilder } from 'jovo-core';
import { ConversationalActionRequest } from './ConversationalActionRequest';
const samples: { [key: string]: string } = {
  LaunchRequest: './../../sample-request-json/LAUNCH.json',
  IntentRequest: './../../sample-request-json/IntentRequest.json',
  EndRequest: './../../sample-request-json/EndRequest.json',
};

export class GoogleAssistantRequestBuilder implements RequestBuilder<ConversationalActionRequest> {
  type = 'GoogleAction';

  launch(json?: object): Promise<ConversationalActionRequest> {
    //tslint:disable-line
    return this.launchRequest(json);
  }
  async intent(json?: object): Promise<ConversationalActionRequest>; //tslint:disable-line
  async intent(name?: string, inputs?: any): Promise<ConversationalActionRequest>; //tslint:disable-line
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
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(samples['LaunchRequest']));
      return ConversationalActionRequest.fromJSON(JSON.parse(request));
    }
  }
  async intentRequest(json?: object): Promise<ConversationalActionRequest> {
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(samples['IntentRequest']));
      return ConversationalActionRequest.fromJSON(JSON.parse(request));
    }
  }

  async rawRequest(json: object): Promise<ConversationalActionRequest> {
    //tslint:disable-line
    return ConversationalActionRequest.fromJSON(json);
  }

  async rawRequestByKey(key: string): Promise<ConversationalActionRequest> {
    const request = JSON.stringify(require(samples[key]));
    return ConversationalActionRequest.fromJSON(JSON.parse(request));
  }

  // TODO:
  async audioPlayerRequest(json?: object): Promise<ConversationalActionRequest> {
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
      const request = JSON.stringify(require(samples['IntentRequest1']));
      return ConversationalActionRequest.fromJSON(JSON.parse(request));
    }
  }

  async end(json?: object): Promise<ConversationalActionRequest> {
    if (json) {
      return ConversationalActionRequest.fromJSON(json);
    } else {
      const request = JSON.stringify(require(samples['EndRequest']));
      return ConversationalActionRequest.fromJSON(JSON.parse(request));
    }
  }
}
