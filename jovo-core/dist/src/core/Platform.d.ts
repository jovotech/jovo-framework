import { JovoRequest, JovoResponse } from '../Interfaces';
import { RequestBuilder, ResponseBuilder, TestSuite } from '../TestSuite';
import { Extensible, ExtensibleConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
export declare abstract class Platform<REQ extends JovoRequest = JovoRequest, RES extends JovoResponse = JovoResponse> extends Extensible {
    requestBuilder?: RequestBuilder<REQ>;
    responseBuilder?: ResponseBuilder<RES>;
    constructor(config?: ExtensibleConfig);
    abstract makeTestSuite(): TestSuite<RequestBuilder<REQ>, ResponseBuilder<RES>>;
    abstract getAppType(): string;
    supportsASR(): boolean;
    supportsTTS(): boolean;
    protected setup(handleRequest: HandleRequest): Promise<void>;
}
