export { CosmosDb } from './CosmosDb';
export { Config } from 'jovo-db-mongodb';
import { Config } from 'jovo-db-mongodb';
interface AppCosmosDbConfig {
    CosmosDb?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppCosmosDbConfig {
    }
    interface ExtensiblePluginConfigs extends AppCosmosDbConfig {
    }
}
