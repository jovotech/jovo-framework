import { MongoDb, MongoDbConfig } from './MongoDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    MongoDb?: MongoDbConfig;
  }

  interface ExtensiblePlugins {
    MongoDb?: MongoDb;
  }
}

export { MongoDb, MongoDbConfig } from './MongoDb';
