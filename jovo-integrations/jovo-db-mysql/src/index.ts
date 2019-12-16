export { MySQL, Config } from './MySQL';

import { Config } from './MySQL';

interface AppMySQLConfig {
  MySQL?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppMySQLConfig {}
  export interface ExtensiblePluginConfigs extends AppMySQLConfig {}
}
