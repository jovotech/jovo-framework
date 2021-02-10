export { MySQL, Config } from './MySQL';
import { Config } from './MySQL';
interface AppMySQLConfig {
    MySQL?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppMySQLConfig {
    }
    interface ExtensiblePluginConfigs extends AppMySQLConfig {
    }
}
