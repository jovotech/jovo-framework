import { EnumLike, HandleOptions, Jovo } from '@jovotech/framework';
import { AlexaRequest } from './AlexaRequest';
import { PermissionStatus, PurchaseResultLike } from './interfaces';

export type PermissionType = 'timers' | 'reminders';

export enum IspRequest {
  Upsell = 'Upsell',
  Buy = 'Buy',
  Cancel = 'Cancel',
}

export type IspRequestLike = EnumLike<IspRequest> | string;

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

  static onIsp(type: IspRequestLike, purchaseResult?: PurchaseResultLike): HandleOptions {
    return {
      global: true,
      types: ['Connections.Response'],
      platforms: ['alexa'],
      if: (jovo: Jovo) => {
        const result = purchaseResult
          ? (jovo.$request as AlexaRequest).request?.payload?.purchaseResult === purchaseResult
          : true;

        return (jovo.$request as AlexaRequest).request?.name === type && result;
      },
    };
  }
}
