import { JovoSanity } from './JovoSanity';
import { SanityCms, SanityCmsConfig } from './SanityCms';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    SanityCms?: SanityCmsConfig;
  }

  interface ExtensiblePlugins {
    SanityCms?: SanityCms;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $sanity: JovoSanity;
  }
}

export * from './SanityCms';
export * from './transformers';
