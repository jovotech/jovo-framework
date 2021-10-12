import { PermissionStatus } from './interfaces';
import { HandleOptions, Jovo } from '@jovotech/framework';
import { AlexaRequest } from './AlexaRequest';

export type PermissionType = 'timers' | 'reminders';

export class AlexaHandles {
  static onPermission(status: PermissionStatus, type?: PermissionType): HandleOptions {
    return {
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

  static onPermissionAccepted(type?: PermissionType): HandleOptions {
    return AlexaHandles.onPermission('ACCEPTED', type);
  }

  static onPermissionDenied(type?: PermissionType): HandleOptions {
    return AlexaHandles.onPermission('DENIED', type);
  }
}
