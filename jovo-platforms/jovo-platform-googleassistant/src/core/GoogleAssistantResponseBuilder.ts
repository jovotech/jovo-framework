import {ResponseBuilder} from "jovo-core";
import {GoogleActionResponse} from "./GoogleActionResponse";

export class GoogleAssistantResponseBuilder implements ResponseBuilder<GoogleActionResponse> {
    create(json: any): GoogleActionResponse { // tslint:disable-line
        return GoogleActionResponse.fromJSON(json);
    }
}
