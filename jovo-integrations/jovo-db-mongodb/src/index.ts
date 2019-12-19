export { MongoDb, Config } from './MongoDb';

import { Config } from './MongoDb';

interface AppMongoDbConfig {
  MongoDb?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppMongoDbConfig {}
  export interface ExtensiblePluginConfigs extends AppMongoDbConfig {}
}
