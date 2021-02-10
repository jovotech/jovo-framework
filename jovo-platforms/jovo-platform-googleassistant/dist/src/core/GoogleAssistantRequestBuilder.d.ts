import { GoogleActionRequest } from './GoogleActionRequest';
import { RequestBuilder } from 'jovo-core';
export declare class GoogleAssistantRequestBuilder implements RequestBuilder<GoogleActionRequest> {
    type: string;
    launch(json?: object): Promise<GoogleActionRequest>;
    intent(json?: object): Promise<GoogleActionRequest>;
    intent(name?: string, inputs?: any): Promise<GoogleActionRequest>;
    launchRequest(json?: object): Promise<GoogleActionRequest>;
    intentRequest(json?: object): Promise<GoogleActionRequest>;
    rawRequest(json: object): Promise<GoogleActionRequest>;
    rawRequestByKey(key: string): Promise<GoogleActionRequest>;
    audioPlayerRequest(json?: object): Promise<GoogleActionRequest>;
    end(json?: object): Promise<GoogleActionRequest>;
}
