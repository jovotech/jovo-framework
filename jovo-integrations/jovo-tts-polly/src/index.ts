import { Config } from './PollyTts';

interface AppPollyTtsConfig {
  PollyTts?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppPollyTtsConfig {}
}

export { PollyTts } from './PollyTts';
export * from './Interfaces';
