import { MongoDb, MongoDbConfig } from './MongoDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    DynamoDb?: MongoDbConfig;
  }

  interface ExtensiblePlugins {
    DynamoDb?: MongoDb;
  }
}

export { MongoDb, MongoDbConfig } from './MongoDb';
