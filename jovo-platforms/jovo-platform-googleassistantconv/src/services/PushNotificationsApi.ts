import { HttpService, Log } from 'jovo-core';

export interface Notification {
  title: string;
  userId: string;
  intent: string;
  locale?: string;
}

export interface NotificationFull {
  userNotification: {
    title: string;
  };
  target: {
    userId: string;
    intent: string;
    locale: string;
  };
}

export interface Config {
  isInSandbox: boolean;
}

export class PushNotificationsApi {
  config: Config = {
    isInSandbox: true,
  };

  // tslint:disable-next-line:no-any
  constructor(private serviceAccount: any) {}

  async sendPushNotification(notification: Notification) {
    try {
      require('google-auth-library');
    } catch (e) {
      Log.error('Please install google-auth-library: npm install google-auth-library --save');
      return;
    }
    const { JWT, auth } = require('google-auth-library');

    const jwtClient = new JWT(
      this.serviceAccount.client_email,
      undefined,
      this.serviceAccount.private_key,
      ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
      undefined,
    );
    const token = await jwtClient.authorize();

    const notificationFull: NotificationFull = {
      target: {
        intent: notification.intent,
        userId: notification.userId,
        locale: notification.locale || 'en',
      },
      userNotification: {
        title: notification.title,
      },
    };
    return HttpService.post<unknown>(
      'https://actions.googleapis.com/v2/conversations:send',
      {
        customPushMessage: notificationFull,
        isInSandbox: this.config.isInSandbox,
      },
      {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
