export { Firestore, Config } from './Firestore';
import { Config } from './Firestore';
interface AppFirestoreConfig {
    Firestore?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppFirestoreConfig {
    }
    interface ExtensiblePluginConfigs extends AppFirestoreConfig {
    }
}
