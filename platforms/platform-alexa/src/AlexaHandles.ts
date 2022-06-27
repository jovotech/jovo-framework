import { EnumLike, HandleOptions, Jovo } from '@jovotech/framework';
import { AlexaRequest } from './AlexaRequest';
import { PermissionStatus, PurchaseResultLike } from './interfaces';

export type PermissionType = 'timers' | 'reminders';

export enum IspType {
  Upsell = 'Upsell',
  Buy = 'Buy',
  Cancel = 'Cancel',
}

export enum AudioPlayerType {
  PlaybackStarted = 'AudioPlayer.PlaybackStarted',
  PlaybackNearlyFinished = 'AudioPlayer.PlaybackNearlyFinished',
  PlaybackFinished = 'AudioPlayer.PlaybackFinished',
  PlaybackStopped = 'AudioPlayer.PlaybackStopped',
  PlaybackFailed = 'AudioPlayer.PlaybackFailed',
}

export enum PlaybackControllerType {
  NextCommandIssued = 'PlaybackController.NextCommandIssued',
  PreviousCommandIssued = 'PlaybackController.PreviousCommandIssued',
  PlayCommandIssued = 'PlaybackController.PlayCommandIssued',
  PauseCommandIssued = 'PlaybackController.PauseCommandIssued',
}

export type IspTypeLike = EnumLike<IspType> | string;
export type AudioPlayerTypeLike = EnumLike<AudioPlayerType> | string;
export type PlaybackControllerTypeLike = EnumLike<PlaybackControllerType> | string;

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

  static onIsp(type: IspTypeLike, purchaseResult?: PurchaseResultLike): HandleOptions {
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

  static onDialogApiInvoked(name?: string): HandleOptions {
    return {
      global: true,
      types: ['Dialog.API.Invoked'],
      platforms: ['alexa'],
      if: (jovo: Jovo) =>
        name ? (jovo.$request as AlexaRequest).request?.apiRequest?.name === name : true,
    };
  }

  static onAudioPlayer(type: AudioPlayerTypeLike): HandleOptions {
    return {
      global: true,
      types: [type],
      platforms: ['alexa'],
    };
  }

  static onPlaybackController(type: PlaybackControllerTypeLike): HandleOptions {
    return {
      global: true,
      types: [type],
      platforms: ['alexa'],
    };
  }

  static onCanFulfillIntentRequest(): HandleOptions {
    return {
      global: true,
      types: ['CanFulfillIntentRequest'],
      platforms: ['alexa'],
    };
  }
}
