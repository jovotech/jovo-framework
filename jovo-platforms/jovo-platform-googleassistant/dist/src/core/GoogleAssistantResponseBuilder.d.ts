import { ResponseBuilder } from 'jovo-core';
import { GoogleActionResponse } from './GoogleActionResponse';
export declare class GoogleAssistantResponseBuilder implements ResponseBuilder<GoogleActionResponse> {
    create(json: any): GoogleActionResponse;
}
