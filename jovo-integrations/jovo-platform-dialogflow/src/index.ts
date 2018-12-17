import {JovoRequest} from "jovo-core";

export { Dialogflow } from "./Dialogflow";
export { DialogflowNlu } from "./DialogflowNlu";

declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $originalRequest?: JovoRequest;
    }
}
