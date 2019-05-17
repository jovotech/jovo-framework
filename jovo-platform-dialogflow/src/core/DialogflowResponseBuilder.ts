import {ResponseBuilder} from "jovo-core";
import {DialogflowResponse} from "./DialogflowResponse";
import {PlatformFactory} from "../index";
import {DialogflowFactory} from "./DialogflowFactory";

export class DialogflowResponseBuilder<T extends PlatformFactory = DialogflowFactory> implements ResponseBuilder<DialogflowResponse> {

    constructor(private factory: T) {

    }

    create(json: any): DialogflowResponse { // tslint:disable-line
        return this.factory.createResponse(json) as DialogflowResponse;
    }
}
