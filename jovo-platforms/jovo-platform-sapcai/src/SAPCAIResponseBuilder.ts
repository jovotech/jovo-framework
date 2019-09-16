import {SAPCAIResponse} from "./SAPCAIResponse";
import {ResponseBuilder} from "jovo-core";

export class SAPCAIResponseBuilder implements ResponseBuilder<SAPCAIResponse> {
    create(json: any): SAPCAIResponse { // tslint:disable-line
        return SAPCAIResponse.fromJSON(json);
    }
}
