import { isNode, registerPlatformSpecificJovoReference } from '@jovotech/framework';
import type { SessionParamsReprompts } from '@jovotech/output-googleassistant';
import type { GoogleAssistantCli as GoogleAssistantCliType } from './cli';
import { GoogleAction } from './GoogleAction';
import { GoogleAssistant } from './GoogleAssistant';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleAssistant?: GoogleAssistant;
  }

  interface ExtensiblePlugins {
    GoogleAssistant?: GoogleAssistant;
  }
}

declare module '@jovotech/framework/dist/types/JovoSession' {
  interface JovoSession {
    _GA_REPROMPTS_?: SessionParamsReprompts;
  }

  interface PersistableSessionData {
    _GA_REPROMPTS_?: SessionParamsReprompts;
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
export * from './enums';
