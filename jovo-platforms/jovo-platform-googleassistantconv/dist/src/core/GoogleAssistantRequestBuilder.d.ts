import { RequestBuilder } from 'jovo-core';
import { ConversationalActionRequest } from './ConversationalActionRequest';
export declare class GoogleAssistantRequestBuilder implements RequestBuilder<ConversationalActionRequest> {
    type: string;
    launch(json?: object): Promise<ConversationalActionRequest>;
    intent(json?: object): Promise<ConversationalActionRequest>;
    intent(name?: string, inputs?: any): Promise<ConversationalActionRequest>;
    launchRequest(json?: object): Promise<ConversationalActionRequest>;
    intentRequest(json?: object): Promise<ConversationalActionRequest>;
    rawRequest(json: object): Promise<ConversationalActionRequest>;
    rawRequestByKey(key: string): Promise<ConversationalActionRequest>;
    audioPlayerRequest(json?: object): Promise<ConversationalActionRequest>;
    end(json?: any): Promise<ConversationalActionRequest>;
}
