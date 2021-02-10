import { HandleRequest, Host, Plugin } from 'jovo-core';
import { CorePlatformApp } from '..';
import { CorePlatform } from '../CorePlatform';
export declare class CorePlatformCore implements Plugin {
    protected initFn: (handleRequest: HandleRequest) => Promise<void>;
    protected requestFn: (corePlatformApp: CorePlatformApp) => Promise<void>;
    protected typeFn: (corePlatformApp: CorePlatformApp) => Promise<void>;
    protected sessionFn: (corePlatformApp: CorePlatformApp) => Promise<void>;
    protected outputFn: (corePlatformApp: CorePlatformApp) => void;
    install(platform: CorePlatform): void;
    uninstall(platform?: CorePlatform): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(corePlatformApp: CorePlatformApp): Promise<void>;
    type(corePlatformApp: CorePlatformApp): Promise<void>;
    session(corePlatformApp: CorePlatformApp): Promise<void>;
    output(corePlatformApp: CorePlatformApp): void;
    protected getPlatformType(): 'CorePlatform' | string;
    protected isCoreRequest(request: any): boolean;
    protected overwriteRequestAudioData(host: Host): void;
    protected getSamplesFromAudio(base64: string): Float32Array;
}
