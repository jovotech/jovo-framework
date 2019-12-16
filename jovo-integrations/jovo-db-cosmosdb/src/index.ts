export { CosmosDb } from './CosmosDb';
export { Config } from 'jovo-db-mongodb';

import { Config } from 'jovo-db-mongodb';

interface AppCosmosDbConfig {
  CosmosDb?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppCosmosDbConfig {}
  export interface ExtensiblePluginConfigs extends AppCosmosDbConfig {}
}
