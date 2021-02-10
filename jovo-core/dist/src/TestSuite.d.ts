import { JovoRequest, JovoResponse } from './Interfaces';
import { Conversation, ConversationConfig } from './util/Conversation';
export interface RequestBuilder<T extends JovoRequest = JovoRequest> {
    type: string;
    launch(json?: object): Promise<T>;
    intent(json?: object): Promise<T>;
    intent(name?: string, slots?: any): Promise<T>;
    audioPlayerRequest(json?: object): Promise<T>;
    end(json?: object): Promise<T>;
    rawRequest(json: object): Promise<T>;
    rawRequestByKey(key: string): Promise<T>;
}
export interface ResponseBuilder<T extends JovoResponse = JovoResponse> {
    create(json: object): T;
}
/**
 * Defines a class with static functions for testing purpose.
 */
export declare class TestSuite<T extends RequestBuilder = RequestBuilder, K extends ResponseBuilder = ResponseBuilder> {
    requestBuilder: T;
    responseBuilder: K;
    constructor(requestBuilder: T, responseBuilder: K);
    /**
     * Instantiates conversation object with the given config object.
     * @param {ConversationConfig} config
     * @returns {Conversation}
     */
    conversation(config?: ConversationConfig): Conversation;
}
