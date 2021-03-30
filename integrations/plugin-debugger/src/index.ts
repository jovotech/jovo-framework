import { JovoDebugger, JovoDebuggerConfig } from './JovoDebugger';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    JovoDebugger?: JovoDebuggerConfig;
  }

  interface ExtensiblePlugins {
    JovoDebugger?: JovoDebugger;
  }
}

export * from './JovoDebugger';
