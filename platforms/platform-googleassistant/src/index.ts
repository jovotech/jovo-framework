import { registerPlatformSpecificJovoReference, isNode } from '@jovotech/framework';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';
import type { GoogleAssistantCli as GoogleAssistantCliType } from './cli';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleAssistantPlatform?: GoogleAssistantPlatform;
  }

  interface ExtensiblePlugins {
    GoogleAssistantPlatform?: GoogleAssistantPlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $googleAssistant?: GoogleAssistant;
  }
}
registerPlatformSpecificJovoReference('$googleAssistant', GoogleAssistant);

export const GoogleAssistantCli: typeof GoogleAssistantCliType = isNode()
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').GoogleAssistantCli
  : null;
export * from './GoogleAssistant';
export * from './GoogleAssistantPlatform';
export * from './GoogleAssistantRequest';
export * from './GoogleAssistantUser';
export type { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
export * from './interfaces';
export * from './enums';
