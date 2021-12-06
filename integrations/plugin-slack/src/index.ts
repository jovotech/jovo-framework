import { SlackPlugin, SlackPluginConfig } from './SlackPlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    SlackPlugin?: SlackPluginConfig;
  }

  interface ExtensiblePlugins {
    SlackPlugin?: SlackPlugin;
  }
}

export * from './SlackPlugin';
