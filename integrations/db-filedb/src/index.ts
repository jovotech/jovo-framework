import { FileDb, FileDbConfig } from './FileDb';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    FileDb?: FileDbConfig;
  }

  interface ExtensiblePlugins {
    FileDb?: FileDb;
  }
}

export * from './FileDb';
