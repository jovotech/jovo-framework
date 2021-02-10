import { HandleRequest } from 'jovo-core';
import { CorePlatformCore } from 'jovo-platform-core';
import { WebApp } from '..';
export declare class WebPlatformCore extends CorePlatformCore {
    init(handleRequest: HandleRequest): Promise<void>;
    request(webApp: WebApp): Promise<void>;
    protected getPlatformType(): string;
}
