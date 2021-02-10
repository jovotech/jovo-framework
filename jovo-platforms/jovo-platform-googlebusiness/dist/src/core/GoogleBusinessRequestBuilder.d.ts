import { RequestBuilder } from 'jovo-core';
import { GoogleBusinessBaseRequest } from '../Interfaces';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
export declare class GoogleBusinessRequestBuilder implements RequestBuilder<GoogleBusinessRequest> {
    type: string;
    launch(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    intent(json?: object): Promise<GoogleBusinessRequest>;
    intent(name?: string, slots?: any): Promise<GoogleBusinessRequest>;
    launchRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    intentRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    end(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    audioPlayerRequest(json?: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    rawRequest(json: GoogleBusinessBaseRequest): Promise<GoogleBusinessRequest>;
    rawRequestByKey(key: string): Promise<GoogleBusinessRequest>;
}
