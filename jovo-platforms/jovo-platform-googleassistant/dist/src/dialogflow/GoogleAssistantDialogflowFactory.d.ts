import { BaseApp, HandleRequest, Host } from 'jovo-core';
import { GoogleAction } from '../core/GoogleAction';
import { PlatformFactory, DialogflowRequest, DialogflowRequestJSON, DialogflowResponse, DialogflowResponseJSON } from 'jovo-platform-dialogflow';
export declare class GoogleAssistantDialogflowFactory implements PlatformFactory {
    createPlatformRequest(app: BaseApp, host: Host, handleRequest?: HandleRequest): GoogleAction;
    createRequest(json: DialogflowRequestJSON): DialogflowRequest;
    createResponse(json?: DialogflowResponseJSON): DialogflowResponse;
    type(): string;
}
