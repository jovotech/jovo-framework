import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { LindenbaumTestSuite } from './index';
import { LindenbaumRequest } from './core/LindenbaumRequest';
import { LindenbaumResponse } from './core/LindenbaumResponse';
export declare class Lindenbaum extends Platform<LindenbaumRequest, LindenbaumResponse> {
    static type: string;
    static appType: string;
    constructor(config?: ExtensibleConfig);
    getAppType(): string;
    install(app: BaseApp): void;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    makeTestSuite(): LindenbaumTestSuite;
}
