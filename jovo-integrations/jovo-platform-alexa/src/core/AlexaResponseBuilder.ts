import {AlexaResponse} from "./AlexaResponse";
import {ResponseBuilder} from "jovo-core";

export class AlexaResponseBuilder implements ResponseBuilder {
    create(json: any) { // tslint:disable-line
        return AlexaResponse.fromJSON(json);
    }
}
