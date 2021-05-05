import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { GoogleAction } from './GoogleAction';
import { GoogleAssistant } from './GoogleAssistant';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleAssistant?: GoogleAssistant;
  }

  interface ExtensiblePlugins {
    GoogleAssistant?: GoogleAssistant;
  }
}

declare module '@jovotech/framework/dist/Jovo' {
  interface Jovo {
    $googleAction?: GoogleAction;
  }
}
registerPlatformSpecificJovoReference('$googleAction', GoogleAction);

export * from './GoogleAssistant';
export * from './GoogleAssistantRequest';
export * from './GoogleAssistantUser';
export * from './GoogleAction';
export type { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
export * from './interfaces';
export * from './cli';
