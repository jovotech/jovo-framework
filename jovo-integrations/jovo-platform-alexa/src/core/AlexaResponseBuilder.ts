import {AlexaResponse} from "./AlexaResponse";
import {ResponseBuilder} from "jovo-core";

export class AlexaResponseBuilder implements ResponseBuilder<AlexaResponse> {
    create(json: any): AlexaResponse { // tslint:disable-line
        return AlexaResponse.fromJSON(json);
    }
}
