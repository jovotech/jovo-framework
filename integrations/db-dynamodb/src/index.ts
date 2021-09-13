import { DynamoDb, DynamoDbConfig } from './DynamoDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    DynamoDb?: DynamoDbConfig;
  }

  interface ExtensiblePlugins {
    DynamoDb?: DynamoDb;
  }
}

export { DynamoDb, DynamoDbConfig } from './DynamoDb';
