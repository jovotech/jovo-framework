import {JovoRequest} from "jovo-core";

export { Dialogflow } from "./Dialogflow";
export { DialogflowNlu } from "./DialogflowNlu";
export { DialogflowResponse } from "./core/DialogflowResponse";
export { DialogflowRequest } from "./core/DialogflowRequest";
export { DialogflowRequestBuilder } from "./core/DialogflowRequestBuilder";
export { DialogflowTestSuite } from './core/Interfaces';


declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $originalRequest?: JovoRequest;
    }
}
