import { Handler } from 'jovo-core';

import { Config } from './Bixby';
import { BixbyCapsule } from './core/BixbyCapsule';

export { BixbyCapsule };
export { Bixby } from './Bixby';
export { BixbyCore } from './core/BixbyCore';
export { BixbyRequestBuilder } from './core/BixbyRequestBuilder';
export { BixbyResponseBuilder } from './core/BixbyResponseBuilder';
export { BixbyUser } from './modules/BixbyUser';
export * from './core/BixbyRequest';
export * from './core/BixbyResponse';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $bixbyCapsule?: BixbyCapsule;
    bixbyCapsule(): BixbyCapsule;
    isBixbyCapsule(): boolean;
  }
}

interface AppBixbyConfig {
  Bixby?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppPlatformConfig extends AppBixbyConfig {}
  interface ExtensiblePluginConfigs extends AppBixbyConfig {}
}

declare module 'jovo-core/dist/src/core/BaseApp' {
  interface BaseApp {
    /**
     * Sets alexa handlers
     * @public
     * @param {*} handler
     */
    setBixbyHandler(...handler: Handler[]): this; // tslint:disable-line
  }
}
