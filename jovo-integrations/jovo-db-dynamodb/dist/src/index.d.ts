export { DynamoDb, Config } from './DynamoDb';
import { Config } from './DynamoDb';
interface AppDynamoDbConfig {
    DynamoDb?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppDynamoDbConfig {
    }
    interface ExtensiblePluginConfigs extends AppDynamoDbConfig {
    }
}
