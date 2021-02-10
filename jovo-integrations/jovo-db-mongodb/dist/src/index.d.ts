export { MongoDb, Config } from './MongoDb';
import { Config } from './MongoDb';
interface AppMongoDbConfig {
    MongoDb?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppMongoDbConfig {
    }
    interface ExtensiblePluginConfigs extends AppMongoDbConfig {
    }
}
