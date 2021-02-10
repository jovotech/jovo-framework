import { Config } from './JovoDebugger';
export { JovoDebugger, Config } from './JovoDebugger';
interface AppJovoDebuggerConfig {
    JovoDebugger?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface ExtensiblePluginConfigs extends AppJovoDebuggerConfig {
    }
}
