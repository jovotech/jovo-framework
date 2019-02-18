import {Plugin} from "jovo-core";

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionAPI} from "../services/GoogleActionAPI";
import {google} from "googleapis";
import {Credentials} from "google-auth-library";

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
        const result: Credentials = await this.sendAuthRequest(clientEmail, privateKey);
        return result.access_token;
    }

    /**
     * Authenticates using googleapis package
     * @param {string} clientEmail from service account key
     * @param {string} privateKey from service account key
     * @returns {Credentials}
     */
    async sendAuthRequest(clientEmail: string, privateKey: string) {
        const jwtClient = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
            undefined
        );

        const result: Credentials = await jwtClient.authorize();
        return result;
    }

    /**
     * 
     * @param {NotificationObject} notification 
     * @param {string} accessToken access token from authRequest
     */
    sendNotification(notification: NotificationObject, accessToken: string) {
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