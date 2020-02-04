import { CorePlatformApp } from './core/CorePlatformApp';
import { AdaptiveCardOptions } from './response/visuals/AdaptiveCard';

export * from './CorePlatform';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $corePlatformApp?: CorePlatformApp;

    corePlatformApp(): CorePlatformApp;

    isCorePlatformApp(): boolean;
  }
}

declare module './core/CorePlatformApp' {
  interface CorePlatformApp {
    showAdaptiveCard(options: AdaptiveCardOptions): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {}
}

export * from './core/CorePlatformApp';
export * from './core/CorePlatformRequest';
export * from './core/CorePlatformResponse';
export * from './core/CorePlatformRequestBuilder';
export * from './core/CorePlatformResponseBuilder';
export * from './core/CorePlatformSpeechBuilder';
export * from './core/CorePlatformUser';

export * from './modules/CorePlatformCore';
export * from './modules/Cards';

export * from './response/visuals/AdaptiveCard';
