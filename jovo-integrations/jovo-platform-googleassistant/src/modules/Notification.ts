import {Plugin} from "jovo-core";

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionAPI} from "../services/GoogleActionAPI";
import {google} from "googleapis";

export class Notification {
    googleAction: GoogleAction;

    constructor(googleAction: GoogleAction) {
        this.googleAction = googleAction;
    }

    async getAccessToken(clientEmail: string, privateKey: string) {
        const jwtClient = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
            undefined
        );

        const result = await jwtClient.authorize();
        return result.access_token;
    }

    sendNotification(notification: object, accessToken: string) {
        return GoogleActionAPI.apiCall({
            endpoint: 'https://actions.googleapis.com',
            method: 'POST',
            path: '/v2/conversations:send',
            permissionToken: accessToken,
            json: notification
        });
    }
}

export class NotificationPlugin implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$type')!.use(this.type.bind(this));

        GoogleAction.prototype.$notification = undefined;
        GoogleAction.prototype.notification = function() {
            return this.$notification;
        };
    }

    type(googleAction: GoogleAction) {
        googleAction.$notification = new Notification(googleAction);
    }

    uninstall(googleAssistant: GoogleAssistant) {

    }
}

export interface NotificationObject {
    customPushMessage: {
        userNotification: {
            title: string;
        },
        target: {
            userId: string;
            intent: string; // intent which gets executed after user presses on notification
            locale: string;
        },
    };
}