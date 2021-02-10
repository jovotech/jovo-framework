"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class PushNotificationsApi {
    constructor(serviceAccount) {
        this.serviceAccount = serviceAccount;
        this.config = {
            isInSandbox: true,
        };
    }
    async sendPushNotification(notification) {
        try {
            require('google-auth-library');
        }
        catch (e) {
            jovo_core_1.Log.error('Please install google-auth-library: npm install google-auth-library --save');
            return;
        }
        const { JWT, auth } = require('google-auth-library');
        const jwtClient = new JWT(this.serviceAccount.client_email, undefined, this.serviceAccount.private_key, ['https://www.googleapis.com/auth/actions.fulfillment.conversation'], undefined);
        const token = await jwtClient.authorize();
        const notificationFull = {
            target: {
                intent: notification.intent,
                userId: notification.userId,
                locale: notification.locale || 'en',
            },
            userNotification: {
                title: notification.title,
            },
        };
        return jovo_core_1.HttpService.post('https://actions.googleapis.com/v2/conversations:send', {
            customPushMessage: notificationFull,
            isInSandbox: this.config.isInSandbox,
        }, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
            },
        });
    }
}
exports.PushNotificationsApi = PushNotificationsApi;
//# sourceMappingURL=PushNotificationsApi.js.map