import { AlexaResponse } from './AlexaResponse';
import { ResponseBuilder } from 'jovo-core';
export declare class AlexaResponseBuilder implements ResponseBuilder<AlexaResponse> {
    create(json: any): AlexaResponse;
}
