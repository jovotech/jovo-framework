import { FileDb, FileDbConfig } from './FileDb';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    FileDb?: FileDbConfig;
  }

  interface ExtensiblePlugins {
    FileDb?: FileDb;
  }
}

export * from './FileDb';
