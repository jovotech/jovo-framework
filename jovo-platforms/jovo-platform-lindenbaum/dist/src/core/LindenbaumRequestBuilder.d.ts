import { RequestBuilder } from 'jovo-core';
import { LindenbaumRequest, LindenbaumSessionRequestJSON, LindenbaumMessageRequestJSON, LindenbaumTerminatedRequestJSON, LindenbaumRequestJSON } from './LindenbaumRequest';
export declare class LindenbaumRequestBuilder implements RequestBuilder<LindenbaumRequest> {
    type: string;
    launch(json?: LindenbaumSessionRequestJSON): Promise<LindenbaumRequest>;
    intent(json?: object): Promise<LindenbaumRequest>;
    intent(name?: string, slots?: any): Promise<LindenbaumRequest>;
    launchRequest(json?: LindenbaumSessionRequestJSON): Promise<LindenbaumRequest>;
    intentRequest(json?: LindenbaumMessageRequestJSON): Promise<LindenbaumRequest>;
    end(json?: LindenbaumTerminatedRequestJSON): Promise<LindenbaumRequest>;
    /**
     * Autopilot doesn't have audio player requests
     */
    audioPlayerRequest(json?: object): Promise<LindenbaumRequest>;
    rawRequest(json: LindenbaumRequestJSON): Promise<LindenbaumRequest>;
    rawRequestByKey(key: string): Promise<LindenbaumRequest>;
}
