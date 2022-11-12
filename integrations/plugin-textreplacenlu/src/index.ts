import { TextReplaceNluPlugin, TextReplaceNluPluginConfig } from './TextReplaceNluPlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    TextReplaceNluPlugin?: TextReplaceNluPluginConfig;
  }

  interface ExtensiblePlugins {
    TextReplaceNluPlugin?: TextReplaceNluPlugin;
  }
}

export * from './TextReplaceNluPlugin';
