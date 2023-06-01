import { RedisDb, RedisDbConfig } from './RedisDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    RedisDb?: RedisDbConfig;
  }

  interface ExtensiblePlugins {
    RedisDb?: RedisDb;
  }
}

export * from './RedisDb';
