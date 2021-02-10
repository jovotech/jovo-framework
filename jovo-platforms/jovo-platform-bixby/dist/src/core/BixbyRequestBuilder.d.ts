import { RequestBuilder } from 'jovo-core';
import { BixbyRequest } from './BixbyRequest';
export declare class BixbyRequestBuilder implements RequestBuilder<BixbyRequest> {
    type: string;
    launch(json?: any): Promise<BixbyRequest>;
    launchRequest(json?: any): Promise<BixbyRequest>;
    intent(json?: object | undefined): Promise<BixbyRequest>;
    intent(name?: string | undefined, slots?: any): Promise<BixbyRequest>;
    audioPlayerRequest(json?: object | undefined): Promise<BixbyRequest>;
    end(json?: object | undefined): Promise<BixbyRequest>;
    rawRequest(json: object): Promise<BixbyRequest>;
    rawRequestByKey(key: string): Promise<BixbyRequest>;
}
