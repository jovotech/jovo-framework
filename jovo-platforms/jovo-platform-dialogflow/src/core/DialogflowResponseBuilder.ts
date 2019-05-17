import {ResponseBuilder} from "jovo-core";
import {DialogflowResponse} from "./DialogflowResponse";
import {DialogflowFactory} from "./DialogflowFactory";
import {PlatformFactory} from "../index";

export class DialogflowResponseBuilder<T extends PlatformFactory = DialogflowFactory> implements ResponseBuilder<DialogflowResponse> {

    constructor(private factory: T) {

    }

    create(json: any): DialogflowResponse { // tslint:disable-line
        return this.factory.createResponse(json) as DialogflowResponse;
    }
}
