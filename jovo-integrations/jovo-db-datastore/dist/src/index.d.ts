export { DatastoreDb, Config } from './DatastoreDb';
import { Config } from './DatastoreDb';
interface AppDatastoreDbConfig {
    DatastoreDb?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppDatastoreDbConfig {
    }
    interface ExtensiblePluginConfigs extends AppDatastoreDbConfig {
    }
}
