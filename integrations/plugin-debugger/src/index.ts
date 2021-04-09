import { HandleRequest } from '@jovotech/core';
import { JovoDebugger, JovoDebuggerConfig } from './JovoDebugger';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    JovoDebugger?: JovoDebuggerConfig;
  }

  interface ExtensiblePlugins {
    JovoDebugger?: JovoDebugger;
  }
}

declare module '@jovotech/core/dist/HandleRequest' {
  interface HandleRequest {
    requestId: number;
  }
}

HandleRequest.prototype.requestId = 0;

export * from './JovoDebugger';
