import {BaseApp, HandleRequest, Host} from "jovo-core";
import {GoogleAction} from "../core/GoogleAction";
import {
    PlatformFactory,
    DialogflowRequest,
    DialogflowRequestJSON,
    DialogflowResponse,
    DialogflowResponseJSON
} from "jovo-platform-dialogflow";
import {GoogleActionRequest, GoogleActionRequestJSON} from "../core/GoogleActionRequest";
import {GoogleActionResponse, GoogleActionResponseJSON} from "../core/GoogleActionResponse";


export class GoogleAssistantDialogflowFactory implements PlatformFactory {
    createPlatformRequest(app: BaseApp, host: Host, handleRequest?: HandleRequest): GoogleAction {
        return new GoogleAction(app, host, handleRequest);
    }

    createRequest(json: DialogflowRequestJSON): DialogflowRequest {
        const dialogflowRequest = DialogflowRequest.fromJSON(json);


        dialogflowRequest.originalDetectIntentRequest!.payload = GoogleActionRequest.fromJSON(dialogflowRequest.originalDetectIntentRequest!.payload as GoogleActionRequestJSON);
        return dialogflowRequest;
    }

    createResponse(json?: DialogflowResponseJSON): DialogflowResponse {
        if (json) {
            const dialogflowResponse = DialogflowResponse.fromJSON(json);
            dialogflowResponse.payload[this.type()] = GoogleActionResponse.fromJSON(
                dialogflowResponse.payload[this.type()] as GoogleActionResponseJSON
            );
            return dialogflowResponse;

        } else {
            return new DialogflowResponse();
        }
    }

    type() {
        return 'google';
    }
}

