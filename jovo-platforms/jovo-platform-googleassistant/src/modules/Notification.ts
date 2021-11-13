import { Plugin, JovoError, ErrorCode } from 'jovo-core';

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { GoogleActionAPI } from '../services/GoogleActionAPI';

export class Notification {
  googleAction: GoogleAction;
  google: any; // tslint:disable-line

  constructor(googleAction: GoogleAction) {
    this.googleAction = googleAction;
  }

  /**
   * Gets only the access token instead of the whole credentials object
   * @param {string} clientEmail from service account key
   * @param {string} privateKey from service account key
   * @returns {string} access token
   */
  async getAccessToken(clientEmail: string, privateKey: string) {
    const result = await this.sendAuthRequest(clientEmail, privateKey);
    return result.access_token;
  }

  /**
   * Authenticates using googleapis package
   * @param {string} clientEmail from service account key
   * @param {string} privateKey from service account key
   */
  async sendAuthRequest(clientEmail: string, privateKey: string) {
    if (!clientEmail || !privateKey) {
      throw new JovoError(
        "Couldn't authenticate. clientEmail and privateKey have to be set",
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
        "To authorize yourself, you have to provide your service account's clientEmail and privateKey",
        undefined,
        'https://v3.jovo.tech/docs/google-assistant/notifications#configuration',
      );
    }

    const jwtClient = new this.google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
      undefined,
    );

    const result = await jwtClient.authorize();
    return result;
  }

  /**
   *
   * @param {NotificationObject} notification
   * @param {string} accessToken access token from authRequest
   */
  sendNotification(notification: NotificationObject, accessToken: string) {
    if (!notification) {
      throw new JovoError(
        "Couldn't send notification. notification has to be set",
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
        undefined,
        undefined,
        'https://v3.jovo.tech/docs/google-assistant/notifications#notification-object',
      );
    }

    if (!accessToken) {
      throw new JovoError(
        "Couldn't send notification. accessToken has to be set.",
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
        undefined,
        'Get an access token using `this.$googleAction.$notification.getAccessToken(clientEmail, privateKey)`',
        'https://v3.jovo.tech/docs/google-assistant/notifications#access-token',
      );
    }

    return GoogleActionAPI.apiCall({
      endpoint: 'https://actions.googleapis.com',
      method: 'POST',
      path: '/v2/conversations:send',
      permissionToken: accessToken,
      json: notification,
    });
  }
}

export class NotificationPlugin implements Plugin {
  google: any; // tslint:disable-line

  install(googleAssistant: GoogleAssistant) {
    /**
     * Notification.ts needs the googleapis package to function.
     * To reduce overall package size, googleapis wasn't added as a dependency.
     * googleapis has to be manually installed
     */
    try {
      this.google = require('googleapis').google;
    } catch (e) {
      if (e.message === "Cannot find module 'googleapis'") {
        throw new JovoError(
          e.message,
          ErrorCode.ERR,
          'jovo-platform-googleassistant',
          undefined,
          'Please run `npm install googleapis`',
        );
      }
    }

    googleAssistant.middleware('$type')!.use(this.type.bind(this));

    GoogleAction.prototype.$notification = undefined;
    GoogleAction.prototype.notification = function () {
      return this.$notification;
    };
  }

  type(googleAction: GoogleAction) {
    googleAction.$notification = new Notification(googleAction);
    googleAction.$notification.google = this.google;
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}

export interface NotificationObject {
  customPushMessage: {
    userNotification: {
      title: string;
    };
    target: {
      userId: string;
      intent: string; // intent which gets executed after user presses on notification
      locale: string;
    };
  };
}
