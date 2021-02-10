import { ExtensibleConfig, Platform, BaseApp, HandleRequest } from 'jovo-core';
import { AutopilotRequest } from './core/AutopilotRequest';
import { AutopilotResponse } from './core/AutopilotResponse';
import { AutopilotTestSuite } from './index';
export declare class Autopilot extends Platform<AutopilotRequest, AutopilotResponse> {
    constructor(config?: ExtensibleConfig);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): AutopilotTestSuite;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
}
