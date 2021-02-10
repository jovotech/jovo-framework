import { BaseApp, HandleRequest, Host } from 'jovo-core';
import { CorePlatformApp } from 'jovo-platform-core';
import { WebAppSpeechBuilder } from './WebAppSpeechBuilder';
import { WebAppUser } from './WebAppUser';
export declare class WebApp extends CorePlatformApp {
    $webApp: WebApp;
    $user: WebAppUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    getType(): string;
    getPlatformType(): 'WebPlatform' | string;
    speechBuilder(): WebAppSpeechBuilder | undefined;
    getSpeechBuilder(): WebAppSpeechBuilder | undefined;
}
