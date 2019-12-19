import { Config as FileDbConfig } from './FileDb';
import { Config as FileDb2Config } from './FileDb2';

interface AppFileDbConfig {
  FileDb?: FileDbConfig;
  FileDb2?: FileDb2Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppFileDbConfig {}
  export interface ExtensiblePluginConfigs extends AppFileDbConfig {}
}

export { FileDb, Config } from './FileDb';
export { FileDb2, Config as FileDb2Config } from './FileDb2';
