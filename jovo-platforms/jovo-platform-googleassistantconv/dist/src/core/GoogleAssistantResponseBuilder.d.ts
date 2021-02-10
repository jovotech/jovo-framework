import { ResponseBuilder } from 'jovo-core';
import { ConversationalActionResponse } from './ConversationalActionResponse';
export declare class GoogleAssistantResponseBuilder implements ResponseBuilder<ConversationalActionResponse> {
    create(json: any): ConversationalActionResponse;
}
