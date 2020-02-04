import { BaseApp, HandleRequest, Host, Jovo, JovoRequest, JovoResponse } from 'jovo-core';
import { DialogflowAgent } from './DialogflowAgent';
import { Context, DialogflowRequest } from './core/DialogflowRequest';
import { DialogflowResponse } from './core/DialogflowResponse';
import { DialogflowConfig } from './Dialogflow';

export { Dialogflow, DialogflowConfig } from './Dialogflow';
export { DialogflowResponse, DialogflowResponseJSON } from './core/DialogflowResponse';
export { DialogflowRequest, DialogflowRequestJSON } from './core/DialogflowRequest';

export { DialogflowRequestBuilder } from './core/DialogflowRequestBuilder';
export { DialogflowTestSuite } from './core/Interfaces';

export { FacebookMessenger } from './integrations/FacebookMessenger/FacebookMessenger';
export { Slack } from './integrations/Slack/Slack';
export { Twilio } from './integrations/Twilio/Twilio';
export { DialogflowPlugin } from './integrations/DialogflowPlugin';

export { EntityOverrideMode, SessionEntity, SessionEntityType } from './core/Interfaces';

export interface PlatformFactory<T extends Jovo = Jovo> {
  createPlatformRequest(app: BaseApp, host: Host, handleRequest?: HandleRequest): T;

  createRequest(json?: any): DialogflowRequest; // tslint:disable-line
  createResponse(json?: any): DialogflowResponse; // tslint:disable-line
  type(): string;
}

declare module './DialogflowAgent' {
  interface DialogflowAgent {
    isFacebookMessengerBot(): boolean;

    isSlackBot(): boolean;

    isTwilioBot(): boolean;
  }
}
declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $originalRequest?: JovoRequest;
    $originalResponse?: JovoResponse;

    $dialogflowAgent: DialogflowAgent;
  }
}

interface AppDialogflowConfig {
  Dialogflow?: DialogflowConfig;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    Dialogflow: {
      Payload?: object;
      OutputContexts?: Context[];
    };
  }

  export interface AppPlatformConfig extends AppDialogflowConfig {}
  export interface ExtensiblePluginConfigs extends AppDialogflowConfig {}
}
