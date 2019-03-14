import {Conversation, ConversationConfig} from "./Conversation";
import {JovoRequest, JovoResponse} from "./Interfaces";

export interface RequestBuilder<T extends JovoRequest = JovoRequest> {
    type: string;
    launch(json?: any): Promise<T>; // tslint:disable-line
    intent(json?: any): Promise<T>; // tslint:disable-line
    intent(name: string, slots: any): Promise<T>; // tslint:disable-line
    audioPlayerRequest(json?: any): Promise<T>; // tslint:disable-line
    end(json?: any): Promise<T>; // tslint:disable-line
    rawRequest(json: any): Promise<T>; // tslint:disable-line
    rawRequestByKey(key: string): Promise<T>; // tslint:disable-line
}

export interface ResponseBuilder<T extends JovoResponse = JovoResponse> {
    create(json: any): T; // tslint:disable-line
}

/**
 * Defines a class with static functions for testing purpose.
 */
export class TestSuite<T extends RequestBuilder = RequestBuilder, K extends ResponseBuilder = ResponseBuilder>  {
    requestBuilder: T;
    responseBuilder: K;
    constructor(requestBuilder: T, responseBuilder: K) {
        this.requestBuilder = requestBuilder;
        this.responseBuilder = responseBuilder;
    }

    /**
     * Instantiates conversation object with the given config object.
     * @param {ConversationConfig} config
     * @returns {Conversation}
     */
    conversation(config?: ConversationConfig): Conversation {
        return new Conversation(this,  config);
    }
}

