import { RequestBuilder } from 'jovo-core';
import { AutopilotRequest } from './AutopilotRequest';
export declare class AutopilotRequestBuilder implements RequestBuilder<AutopilotRequest> {
    type: string;
    launch(json?: object): Promise<AutopilotRequest>;
    intent(json?: object): Promise<AutopilotRequest>;
    intent(name?: string, slots?: any): Promise<AutopilotRequest>;
    launchRequest(json?: object): Promise<AutopilotRequest>;
    intentRequest(json?: object): Promise<AutopilotRequest>;
    /**
     * Autopilot doesn't have audio player requests
     */
    audioPlayerRequest(json?: object): Promise<AutopilotRequest>;
    end(json?: object): Promise<AutopilotRequest>;
    rawRequest(json: object): Promise<AutopilotRequest>;
    rawRequestByKey(key: string): Promise<AutopilotRequest>;
}
