import { Config } from './PulseLabs';

export { PulseLabs, Config } from './PulseLabs';

interface AppPulseLabsConfig {
  PulseLabs?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface ExtensiblePluginConfigs extends AppPulseLabsConfig {}
}
