export { PostgreSQL, Config as PostgreSQLConfig } from './PostgreSQL';

import { Config } from './PostgreSQL';

interface AppPostgreSQLConfig {
  PostgreSQL?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppPostgreSQLConfig {}
  export interface ExtensiblePluginConfigs extends AppPostgreSQLConfig {}
}
