import {JovoRequest} from "jovo-core";
import {Output} from "jovo-core/dist/src/Interfaces";

export { Dialogflow } from "./Dialogflow";
export { DialogflowNlu } from "./DialogflowNlu";
export { DialogflowResponse } from "./core/DialogflowResponse";
export { DialogflowRequest } from "./core/DialogflowRequest";
export { DialogflowRequestBuilder } from "./core/DialogflowRequestBuilder";
export { DialogflowTestSuite } from './core/Interfaces';
import {DialogflowAgent} from "./DialogflowAgent";

export { FacebookMessenger } from './integrations/FacebookMessenger/FacebookMessenger';
export { Slack } from './integrations/Slack/Slack';

declare module './DialogflowAgent' {
    interface DialogflowAgent {
        isFacebookMessengerBot(): boolean;
        isSlackBot(): boolean;
    }
}
declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $originalRequest?: JovoRequest;
        $dialogflowAgent: DialogflowAgent;
    }
}


declare module 'jovo-core/dist/src/Interfaces' {
    interface Output {
        Dialogflow: {
                Payload: object;
        };
    }
}
