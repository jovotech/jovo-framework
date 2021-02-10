import { RequestBuilder } from 'jovo-core';
import { CorePlatformRequest } from './CorePlatformRequest';
export interface CorePlatformRequestConstructor<T extends CorePlatformRequest> {
    new (): T;
    fromJSON(json: any): T;
    reviver(key: string, value: any): any;
}
export declare class CorePlatformRequestBuilder<REQ extends CorePlatformRequest = CorePlatformRequest> implements RequestBuilder<REQ> {
    type: string;
    protected requestClass: CorePlatformRequestConstructor<REQ>;
    launch(json?: object): Promise<REQ>;
    launchRequest(json?: object): Promise<REQ>;
    intent(json?: object): Promise<REQ>;
    intent(name?: string, inputs?: any): Promise<REQ>;
    intentRequest(json?: object): Promise<REQ>;
    rawRequest(json: object): Promise<REQ>;
    rawRequestByKey(key: string): Promise<REQ>;
    audioPlayerRequest(json?: object): Promise<REQ>;
    end(json?: object): Promise<REQ>;
    protected getJsonPath(key: string, version: string): string;
    protected loadJson(key: string, version?: string): any;
}
