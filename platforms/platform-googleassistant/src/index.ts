import { isNode, registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { SessionParamsReprompts } from '@jovotech/output-googleassistant';
import type { GoogleAssistantCli as GoogleAssistantCliType } from './cli';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleAssistantPlatform?: GoogleAssistantPlatform;
  }

  interface ExtensiblePlugins {
    GoogleAssistantPlatform?: GoogleAssistantPlatform;
  }
}

declare module '@jovotech/framework/dist/types/JovoSession' {
  interface JovoSession {
    _GA_REPROMPTS_?: SessionParamsReprompts;
    _GA_SELECTION_INTENT_?: string;
  }

  interface PersistableSessionData {
    _GA_REPROMPTS_?: SessionParamsReprompts;
    _GA_SELECTION_INTENT_?: string;
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
