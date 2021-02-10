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
export declare class PushNotificationsApi {
    private serviceAccount;
    config: Config;
    constructor(serviceAccount: any);
    sendPushNotification(notification: Notification): Promise<import("axios").AxiosResponse<unknown> | undefined>;
}
