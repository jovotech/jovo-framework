import { registerPlatformSpecificJovoReference, isNode } from '@jovotech/framework';
import { GoogleAction } from './GoogleAction';
import { GoogleAssistant } from './GoogleAssistant';
import type { GoogleAssistantCli as GoogleAssistantCliType } from './cli';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleAssistant?: GoogleAssistant;
  }

  interface ExtensiblePlugins {
    GoogleAssistant?: GoogleAssistant;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $googleAction?: GoogleAction;
  }
}
registerPlatformSpecificJovoReference('$googleAction', GoogleAction);

export const GoogleAssistantCli: typeof GoogleAssistantCliType = isNode()
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').GoogleAssistantCli
  : null;
export * from './GoogleAssistant';
export * from './GoogleAssistantRequest';
export * from './GoogleAssistantUser';
export * from './GoogleAction';
export type { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
export * from './interfaces';
