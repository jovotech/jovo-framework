import { Action, Config } from 'jovo-platform-core';
import { WebApp } from './core/WebApp';

export * from 'jovo-platform-core';
export * from './WebPlatform';

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $webApp?: WebApp;

    webApp(): WebApp;

    isWebApp(): boolean;
  }
}

interface AppWebPlatformConfig {
  WebPlatform?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    WebPlatform: {
      Actions: Action[];
      RepromptActions: Action[];
    };
  }

  interface AppPlatformConfig extends AppWebPlatformConfig {}
  interface ExtensiblePluginConfigs extends AppWebPlatformConfig {}
}

export * from './core/WebApp';
export * from './core/WebAppUser';
export * from './core/WebAppRequest';
export * from './core/WebAppResponse';
export * from './core/WebAppSpeechBuilder';
export * from './core/WebPlatformRequestBuilder';
export * from './core/WebPlatformResponseBuilder';

export * from './modules/WebPlatformCore';
