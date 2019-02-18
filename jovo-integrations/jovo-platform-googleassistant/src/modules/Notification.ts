import {Plugin, JovoError, ErrorCode} from "jovo-core";

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionAPI} from "../services/GoogleActionAPI";
import {google} from "googleapis";

export class Notification {
    googleAction: GoogleAction;

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
                'Couldn\'t authenticate. clientEmail and privateKey have to be set',
                ErrorCode.ERR,
                'jovo-platform-googleassistant',
                'To authorize yourself, you have to provide your service account\'s clientEmail and privateKey',
                undefined,
                'https://www.jovo.tech/docs/google-assistant/notifications#configuration'
            )
        }

        const jwtClient = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
            undefined
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
                'Couldn\'t send notification. notification has to be set',
                ErrorCode.ERR,
                'jovo-platform-googleassistant',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/google-assistant/notifications#notification-object'
            )
        }

        if (!accessToken) {
            throw new JovoError(
                'Couldn\'t send notification. accessToken has to be set.',
                ErrorCode.ERR,
                'jovo-platform-googleassistant',
                undefined,
                'Get an access token using `this.$googleAction.$notification.getAccessToken(clientEmail, privateKey)`',
                'https://www.jovo.tech/docs/google-assistant/notifications#access-token'
            )
        }

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