import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class Notification {
    googleAction: GoogleAction;
    google: any;
    constructor(googleAction: GoogleAction);
    getAccessToken(clientEmail: string, privateKey: string): Promise<any>;
    sendAuthRequest(clientEmail: string, privateKey: string): Promise<any>;
    sendNotification(notification: NotificationObject, accessToken: string): Promise<import("../services/GoogleActionAPIResponse").GoogleActionAPIResponse>;
}
export declare class NotificationPlugin implements Plugin {
    google: any;
    install(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
export interface NotificationObject {
    customPushMessage: {
        userNotification: {
            title: string;
        };
        target: {
            userId: string;
            intent: string;
            locale: string;
        };
    };
}
