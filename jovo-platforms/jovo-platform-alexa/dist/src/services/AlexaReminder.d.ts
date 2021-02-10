export declare class AlexaReminder {
    apiEndpoint: string;
    apiAccessToken: string;
    constructor(apiEndpoint: string, apiAccessToken: string);
    /**
     * Sets reminder
     * @param {*} reminder
     * @return {Promise<any>}
     */
    setReminder(reminder: AbsoluteReminder | RelativeReminder): Promise<ReminderResponse>;
    /**
     * Gets reminder
     * @param {string} alertToken
     * @return {Promise<any>}
     */
    getReminder(alertToken: string): Promise<ReminderListResponse>;
    /**
     * Updates reminder
     * @param {string} alertToken
     * @param {*} reminder
     * @return {Promise<any>}
     */
    updateReminder(alertToken: string, reminder: Reminder): Promise<any>;
    /**
     * Deletes reminder
     * @param {string} alertToken
     * @return {Promise<void>}
     */
    deleteReminder(alertToken: string): Promise<any>;
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllReminders(): Promise<ReminderListResponse>;
}
export interface Reminder {
    requestTime: string;
    alertInfo: {
        spokenInfo: {
            content: SpokenInfoContent[];
        };
    };
    pushNotification: {
        status: string;
    };
}
export interface RecurrenceWithFreq {
    freq: string;
    byDay?: string[];
}
export interface RecurrenceWithRules {
    startDateTime: string;
    endDateTime: string;
    recurrenceRules: string[];
}
export interface AbsoluteReminder extends Reminder {
    trigger: {
        type: 'SCHEDULED_ABSOLUTE';
        scheduledTime: string;
        timeZoneId?: string;
        recurrence?: RecurrenceWithFreq | RecurrenceWithRules;
    };
}
export interface RelativeReminder extends Reminder {
    trigger: {
        type: 'SCHEDULED_RELATIVE';
        offsetInSeconds: number;
        timeZoneId?: string;
    };
}
export interface ReminderResponse {
    alertToken: string;
    createdTime: string;
    updatedTime: string;
    status: string;
    version: string;
    href: string;
}
export interface ReminderListResponse {
    totalCount: string;
    alerts: any[];
    links?: string;
}
interface SpokenInfoContent {
    locale: string;
    text?: string;
    ssml?: string;
}
export {};
