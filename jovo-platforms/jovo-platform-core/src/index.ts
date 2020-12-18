import { CorePlatformApp } from './core/CorePlatformApp';
import { Config } from './CorePlatform';
import { Action } from './Interfaces';

export type Version = '3.2.0' | '3.2.1' | '3.2.2' | '3.2.4' | '3.2.5' | '3.3.0' | '3.3.1' | string;

export * from './CorePlatform';

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $corePlatformApp?: CorePlatformApp;

    corePlatformApp(): CorePlatformApp;

    isCorePlatformApp(): boolean;
  }
}

interface AppCorePlatformConfig {
  CorePlatform?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    [key: string]: any;
    CorePlatform: {
      Actions: Action[];
      RepromptActions: Action[];
    };
  }

  interface AppPlatformConfig extends AppCorePlatformConfig {}
  interface ExtensiblePluginConfigs extends AppCorePlatformConfig {}
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
