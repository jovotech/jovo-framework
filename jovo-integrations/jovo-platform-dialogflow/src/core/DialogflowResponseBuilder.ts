import {ResponseBuilder, JovoResponse} from "jovo-core";
import {DialogflowResponse} from "./DialogflowResponse";

export class DialogflowResponseBuilder implements ResponseBuilder {
    platform: string;
    platformResponseClazz: JovoResponse;
    create(json: any) { // tslint:disable-line
        const dialogflowResponse = DialogflowResponse.fromJSON(json) as DialogflowResponse;
        if (dialogflowResponse.payload) {
            // @ts-ignore
            dialogflowResponse.payload[this.platform] = this.platformResponseClazz.fromJSON(dialogflowResponse.payload[this.platform]);
        }
        return dialogflowResponse;
    }
}
