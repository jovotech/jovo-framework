import { Core, CorePlatform, CorePlatformConfig } from '@jovotech/platform-core';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    WebPlatform?: CorePlatformConfig<'web'>;
  }

  interface ExtensiblePlugins {
    WebPlatform?: CorePlatform<'web'>;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $web?: Core;
  }
}

export const WebPlatform = CorePlatform.createCustomPlatform('WebPlatform', 'web');
export * from '@jovotech/platform-core';
