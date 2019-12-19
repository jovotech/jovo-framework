export { DynamoDb, Config } from './DynamoDb';

import { Config } from './DynamoDb';

interface AppDynamoDbConfig {
  DynamoDb?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppDynamoDbConfig {}
  export interface ExtensiblePluginConfigs extends AppDynamoDbConfig {}
}
