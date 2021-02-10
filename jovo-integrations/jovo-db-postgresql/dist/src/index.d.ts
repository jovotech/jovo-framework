export { PostgreSQL, Config as PostgreSQLConfig } from './PostgreSQL';
import { Config } from './PostgreSQL';
interface AppPostgreSQLConfig {
    PostgreSQL?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppPostgreSQLConfig {
    }
    interface ExtensiblePluginConfigs extends AppPostgreSQLConfig {
    }
}
