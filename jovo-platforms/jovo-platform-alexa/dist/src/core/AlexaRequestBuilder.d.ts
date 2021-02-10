import { AlexaRequest } from './AlexaRequest';
import { RequestBuilder } from 'jovo-core';
export declare class AlexaRequestBuilder implements RequestBuilder<AlexaRequest> {
    type: string;
    launch(json?: object): Promise<AlexaRequest>;
    intent(json?: object): Promise<AlexaRequest>;
    intent(name?: string, inputs?: any): Promise<AlexaRequest>;
    launchRequest(json?: object): Promise<AlexaRequest>;
    intentRequest(json?: object): Promise<AlexaRequest>;
    rawRequest(json: object): Promise<AlexaRequest>;
    rawRequestByKey(key: string): Promise<AlexaRequest>;
    audioPlayerRequest(json?: object): Promise<AlexaRequest>;
    /**
     * End
     * @param {object|string} json
     * @return {SessionEndedRequest}
     */
    end(json?: any): Promise<AlexaRequest>;
}
