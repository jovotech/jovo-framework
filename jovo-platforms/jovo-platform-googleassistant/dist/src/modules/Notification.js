"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleAction_1 = require("../core/GoogleAction");
const GoogleActionAPI_1 = require("../services/GoogleActionAPI");
class Notification {
    constructor(googleAction) {
        this.googleAction = googleAction;
    }
    async getAccessToken(clientEmail, privateKey) {
        const result = await this.sendAuthRequest(clientEmail, privateKey);
        return result.access_token;
    }
    async sendAuthRequest(clientEmail, privateKey) {
        if (!clientEmail || !privateKey) {
            throw new jovo_core_1.JovoError("Couldn't authenticate. clientEmail and privateKey have to be set", jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant', "To authorize yourself, you have to provide your service account's clientEmail and privateKey", undefined, 'https://www.jovo.tech/docs/google-assistant/notifications#configuration');
        }
        const jwtClient = new this.google.auth.JWT(clientEmail, undefined, privateKey, ['https://www.googleapis.com/auth/actions.fulfillment.conversation'], undefined);
        const result = await jwtClient.authorize();
        return result;
    }
    sendNotification(notification, accessToken) {
        if (!notification) {
            throw new jovo_core_1.JovoError("Couldn't send notification. notification has to be set", jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant', undefined, undefined, 'https://www.jovo.tech/docs/google-assistant/notifications#notification-object');
        }
        if (!accessToken) {
            throw new jovo_core_1.JovoError("Couldn't send notification. accessToken has to be set.", jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant', undefined, 'Get an access token using `this.$googleAction.$notification.getAccessToken(clientEmail, privateKey)`', 'https://www.jovo.tech/docs/google-assistant/notifications#access-token');
        }
        return GoogleActionAPI_1.GoogleActionAPI.apiCall({
            endpoint: 'https://actions.googleapis.com',
            method: 'POST',
            path: '/v2/conversations:send',
            permissionToken: accessToken,
            json: notification,
        });
    }
}
exports.Notification = Notification;
class NotificationPlugin {
    install(googleAssistant) {
        try {
            this.google = require('googleapis').google;
        }
        catch (e) {
            if (e.message === "Cannot find module 'googleapis'") {
                throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant', undefined, 'Please run `npm install googleapis`');
            }
        }
        googleAssistant.middleware('$type').use(this.type.bind(this));
        GoogleAction_1.GoogleAction.prototype.$notification = undefined;
        GoogleAction_1.GoogleAction.prototype.notification = function () {
            return this.$notification;
        };
    }
    type(googleAction) {
        googleAction.$notification = new Notification(googleAction);
        googleAction.$notification.google = this.google;
    }
    uninstall(googleAssistant) { }
}
exports.NotificationPlugin = NotificationPlugin;
//# sourceMappingURL=Notification.js.map