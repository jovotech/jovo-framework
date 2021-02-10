import { BaseApp, HandleRequest, Host } from 'jovo-core';
import { DialogflowResponse, DialogflowResponseJSON } from './DialogflowResponse';
import { DialogflowRequest, DialogflowRequestJSON } from './DialogflowRequest';
import { DialogflowAgent } from '../DialogflowAgent';
import { PlatformFactory } from '../index';
export declare class DialogflowFactory implements PlatformFactory {
    createPlatformRequest(app: BaseApp, host: Host, handleRequest?: HandleRequest): DialogflowAgent;
    createRequest(json: DialogflowRequestJSON): DialogflowRequest;
    createResponse(json?: DialogflowResponseJSON): DialogflowResponse;
    type(): string;
}
