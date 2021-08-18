import { registerPlatformSpecificJovoReference, isNode } from '@jovotech/framework';
import { AlexaPlatform, AlexaConfig } from './AlexaPlatform';
import { Alexa } from './Alexa';
import type { AlexaCli as AlexaCliType } from './cli';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    AlexaPlatform?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    AlexaPlatform?: AlexaPlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $alexa?: Alexa;
  }
}

registerPlatformSpecificJovoReference('$alexa', Alexa);

export const AlexaCli: typeof AlexaCliType = process.env.JOVO_CLI_SESSION
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').AlexaCli
  : null;
export * from './Alexa';
export * from './AlexaPlatform';
export * from './AlexaRequest';
export * from './AlexaUser';
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './constants';
export * from './interfaces';
export * from './api/ReminderApi';
export * from './output/AskForPermissionConsentCardOutput';
export * from './output/AskForPermissionOutput';
export * from './output/AskForRemindersPermissionOutput';
export * from './output/AskForTimersPermissionOutput';
export * from './conditions/permissions';

export * from './api';
