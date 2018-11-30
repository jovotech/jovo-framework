import {ResponseBuilder} from "jovo-core";
import {GoogleActionResponse} from "./GoogleActionResponse";

export class GoogleAssistantResponseBuilder implements ResponseBuilder {
    create(json: any) { // tslint:disable-line
        return GoogleActionResponse.fromJSON(json);
    }
}
