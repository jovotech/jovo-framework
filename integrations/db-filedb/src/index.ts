import { FileDb, FileDbConfig } from './FileDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    FileDb?: FileDbConfig;
  }

  interface ExtensiblePlugins {
    FileDb?: FileDb;
  }
}

export * from './FileDb';
