export { Firestore, Config } from './Firestore';

import { Config } from './Firestore';

interface AppFirestoreConfig {
  Firestore?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppFirestoreConfig {}
  export interface ExtensiblePluginConfigs extends AppFirestoreConfig {}
}
