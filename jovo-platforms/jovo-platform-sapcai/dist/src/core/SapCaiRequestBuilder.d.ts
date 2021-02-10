import { SapCaiRequest } from './SapCaiRequest';
import { RequestBuilder } from 'jovo-core';
export declare class SapCaiRequestBuilder implements RequestBuilder<SapCaiRequest> {
    type: string;
    launch(json?: object): Promise<SapCaiRequest>;
    intent(json?: object): Promise<SapCaiRequest>;
    intent(name?: string, inputs?: any): Promise<SapCaiRequest>;
    launchRequest(json?: object): Promise<SapCaiRequest>;
    intentRequest(json?: object): Promise<SapCaiRequest>;
    rawRequest(json: object): Promise<SapCaiRequest>;
    rawRequestByKey(key: string): Promise<SapCaiRequest>;
    audioPlayerRequest(json?: object): Promise<SapCaiRequest>;
    end(json?: any): Promise<SapCaiRequest>;
}
