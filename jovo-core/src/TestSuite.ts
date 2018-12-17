import {Conversation, ConversationConfig} from "./Conversation";
import {JovoRequest, JovoResponse} from "./Interfaces";

export interface RequestBuilder {
    type: string;
    launch(json?: any): Promise<JovoRequest>; // tslint:disable-line
    intent(json?: any): Promise<JovoRequest>; // tslint:disable-line
    intent(name: string, slots: any): Promise<JovoRequest>; // tslint:disable-line
    audioPlayerRequest(json?: any): Promise<JovoRequest>; // tslint:disable-line
    end(json?: any): Promise<JovoRequest>; // tslint:disable-line
    rawRequest(json: any): Promise<JovoRequest>; // tslint:disable-line
    rawRequestByKey(key: string): Promise<JovoRequest>; // tslint:disable-line
}

export interface ResponseBuilder {
    create(json: any): JovoResponse; // tslint:disable-line
}

/**
 * Defines a class with static functions for testing purpose.
 */
export class TestSuite {
    requestBuilder: RequestBuilder;
    responseBuilder: ResponseBuilder;
    constructor(requestBuilder: RequestBuilder, responseBuilder: ResponseBuilder) {
        this.requestBuilder = requestBuilder;
        this.responseBuilder = responseBuilder;
    }
    conversation(config?: ConversationConfig): Conversation {
        return new Conversation(this,  config);
    }
}

