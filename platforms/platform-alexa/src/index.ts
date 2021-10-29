import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { Alexa } from './Alexa';
import { AlexaConfig, AlexaPlatform } from './AlexaPlatform';
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

export const AlexaCli: typeof AlexaCliType = process.env.JOVO_CLI_RUNTIME
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').AlexaCli
  : null;
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './Alexa';
export * from './AlexaPlatform';
export * from './AlexaRequest';
export * from './AlexaRequestBuilder';
export * from './AlexaUser';
export * from './api';
export * from './api/ReminderApi';
export * from './constants';
export * from './interfaces';
export * from './output/AskForPermissionConsentCardOutput';
export * from './output/AskForPermissionOutput';
export * from './output/AskForRemindersPermissionOutput';
export * from './output/AskForTimersPermissionOutput';
export * from './AlexaHandles';
