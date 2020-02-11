import { CorePlatformApp } from './core/CorePlatformApp';

export * from './CorePlatform';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $corePlatformApp?: CorePlatformApp;

    corePlatformApp(): CorePlatformApp;

    isCorePlatformApp(): boolean;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {}
}

export * from './Interfaces';
export * from './core/CorePlatformApp';
export * from './core/CorePlatformRequest';
export * from './core/CorePlatformResponse';
export * from './core/CorePlatformRequestBuilder';
export * from './core/CorePlatformResponseBuilder';
export * from './core/CorePlatformSpeechBuilder';
export * from './core/CorePlatformUser';

export * from './modules/CorePlatformCore';
export * from './ActionBuilder';
