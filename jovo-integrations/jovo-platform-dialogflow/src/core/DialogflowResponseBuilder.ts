import {ResponseBuilder, JovoResponse} from "jovo-core";
import {DialogflowResponse} from "./DialogflowResponse";

export class DialogflowResponseBuilder implements ResponseBuilder<DialogflowResponse> {
    platform: string;
    platformResponseClazz: JovoResponse;
    create(json: any): DialogflowResponse { // tslint:disable-line
        const dialogflowResponse = DialogflowResponse.fromJSON(json) as DialogflowResponse;

        return dialogflowResponse;
    }
}
