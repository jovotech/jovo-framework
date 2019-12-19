export { DatastoreDb, Config } from './DatastoreDb';

import { Config } from './DatastoreDb';

interface AppDatastoreDbConfig {
  DatastoreDb?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppDatastoreDbConfig {}
  export interface ExtensiblePluginConfigs extends AppDatastoreDbConfig {}
}
