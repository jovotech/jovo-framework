import { HandleOptions, Jovo } from '@jovotech/framework';
import { AlexaRequest } from './AlexaRequest';
import { PermissionStatus } from './interfaces';

export type PermissionType = 'timers' | 'reminders';

export class AlexaHandles {
  static onPermission(status: PermissionStatus, type?: PermissionType): HandleOptions {
    return {
      global: true,
      types: ['Connections.Response'],
      platforms: ['alexa'],
      if: (jovo: Jovo) =>
        (jovo.$request as AlexaRequest).request?.name === 'AskFor' &&
        (jovo.$request as AlexaRequest).request?.payload?.status === status &&
        (type
          ? (jovo.$request as AlexaRequest).request?.payload?.permissionScope ===
            `alexa::alerts:${type}:skill:readwrite`
          : true),
    };
  }
}
