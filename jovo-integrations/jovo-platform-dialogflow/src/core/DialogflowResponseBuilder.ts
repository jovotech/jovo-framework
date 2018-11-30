import {ResponseBuilder} from "jovo-core";
import {DialogflowResponse} from "./DialogflowResponse";

export class DialogflowResponseBuilder implements ResponseBuilder {
    create(json: any) { // tslint:disable-line
        return DialogflowResponse.fromJSON(json);
    }
}
