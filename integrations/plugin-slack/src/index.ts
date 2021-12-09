import { JovoSlack } from './JovoSlack';
import { SlackPlugin, SlackPluginConfig } from './SlackPlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    SlackPlugin?: SlackPluginConfig;
  }

  interface ExtensiblePlugins {
    SlackPlugin?: SlackPlugin;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    slack: JovoSlack;
  }
}

export * from './SlackPlugin';
