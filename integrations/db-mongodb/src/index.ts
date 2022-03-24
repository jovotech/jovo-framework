import { MongoDb, MongoDbConfig } from './MongoDb';
import { JovoMongoDb } from './JovoMongoDb';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    MongoDb?: MongoDbConfig;
  }

  interface ExtensiblePlugins {
    MongoDb?: MongoDb;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $mongoDb: JovoMongoDb;
  }
}

export { MongoDb, MongoDbConfig } from './MongoDb';
