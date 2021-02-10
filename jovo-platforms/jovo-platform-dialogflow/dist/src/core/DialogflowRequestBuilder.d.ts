import { RequestBuilder } from 'jovo-core';
import { DialogflowRequest } from './DialogflowRequest';
import { DialogflowFactory } from './DialogflowFactory';
import { PlatformFactory } from '../index';
export declare class DialogflowRequestBuilder<T extends PlatformFactory = DialogflowFactory> implements RequestBuilder<DialogflowRequest> {
    private factory;
    type: string;
    constructor(factory: T);
    launch(json?: object): Promise<DialogflowRequest>;
    intent(json?: object): Promise<DialogflowRequest>;
    intent(name?: string, inputs?: any): Promise<DialogflowRequest>;
    launchRequest(json?: object): Promise<DialogflowRequest>;
    intentRequest(json?: object): Promise<DialogflowRequest>;
    rawRequest(json: object): Promise<DialogflowRequest>;
    rawRequestByKey(key: string): Promise<DialogflowRequest>;
    audioPlayerRequest(json?: object): Promise<DialogflowRequest>;
    end(json?: object): Promise<DialogflowRequest>;
    getPlatformRequest(key: string, platform: string): Promise<any>;
}
