import { HandleRequest } from '@jovotech/framework';
import { JovoDebugger, JovoDebuggerConfig } from './JovoDebugger';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    JovoDebugger?: JovoDebuggerConfig;
  }

  interface ExtensiblePlugins {
    JovoDebugger?: JovoDebugger;
  }
}

declare module '@jovotech/framework/dist/HandleRequest' {
  interface HandleRequest {
    debuggerRequestId: number;
  }
}

HandleRequest.prototype.debuggerRequestId = 0;

export * from './JovoDebugger';
