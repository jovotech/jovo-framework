import { BaseApp, HandleRequest, Host } from 'jovo-core';
import { DialogflowResponse, DialogflowResponseJSON } from './DialogflowResponse';
import { DialogflowRequest, DialogflowRequestJSON } from './DialogflowRequest';
import { DialogflowAgent } from '../DialogflowAgent';
import { PlatformFactory } from '../index';

export class DialogflowFactory implements PlatformFactory {
  createPlatformRequest(app: BaseApp, host: Host, handleRequest?: HandleRequest): DialogflowAgent {
    return new DialogflowAgent(app, host, handleRequest);
  }

  createRequest(json: DialogflowRequestJSON): DialogflowRequest {
    return DialogflowRequest.fromJSON(json);
  }

  createResponse(json?: DialogflowResponseJSON): DialogflowResponse {
    if (json) {
      return DialogflowResponse.fromJSON(json);
    } else {
      return new DialogflowResponse();
    }
  }

  type() {
    return 'dialogflow';
  }
}
