export declare class AlexaTimer {
    apiEndpoint: string;
    apiAccessToken: string;
    constructor(apiEndpoint: string, apiAccessToken: string);
    setTimer(timer: NotifyOnlyTimer | AnnounceTimer | LaunchTaskTimer): Promise<TimerResponse>;
    /**
     * Gets Timer
     * @param {string} id
     * @return {Promise<any>}
     */
    getTimer(id: string): Promise<TimerListResponse>;
    /**
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    cancelTimer(id: string): Promise<any>;
    /**
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    pauseTimer(id: string): Promise<any>;
    /**
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    resumeTimer(id: string): Promise<any>;
    /**
     * Deletes all timer
     * @param {string} id
     * @return {Promise<void>}
     */
    cancelAllTimers(): Promise<any>;
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllTimers(): Promise<TimerListResponse>;
}
export declare type TriggeringBehaviorOperation = 'NOTIFY_ONLY' | 'ANNOUNCE' | 'LAUNCH_TASK';
export interface Timer {
    duration: string;
    timerLabel: string;
    creationBehavior: {
        displayExperience: {
            visibility: 'VISIBLE' | 'HIDDEN';
        };
    };
}
export interface NotifyOnlyTimer extends Timer {
    triggeringBehavior: {
        operation: {
            type: 'NOTIFY_ONLY';
        };
        notificationConfig: {
            playAudible: boolean;
        };
    };
}
export interface TextToAnnounce {
    locale: string;
    text: string;
}
export interface AnnounceTimer extends Timer {
    triggeringBehavior: {
        operation: {
            type: 'ANNOUNCE';
            textToAnnounce: TextToAnnounce[];
        };
        notificationConfig: {
            playAudible: boolean;
        };
    };
}
export interface TextToConfirm {
    locale: string;
    text: string;
}
export interface LaunchTaskTimer extends Timer {
    triggeringBehavior: {
        operation: {
            type: 'LAUNCH_TASK';
            task: {
                name: string;
                version: string;
                input?: any;
            };
            textToConfirm: TextToConfirm[];
        };
        notificationConfig: {
            playAudible: boolean;
        };
    };
}
export declare type TimerStatus = 'ON' | 'PAUSED' | 'OFF';
export interface TimerResponse {
    id: string;
    status: TimerStatus;
    duration: string;
    triggerTime: string;
    timerLabel: string;
    createdTime: string;
    updatedTime: string;
    remainingTimeWhenPaused: string;
}
export interface TimerListResponse {
    totalCount: string;
    timers: TimerResponse[];
    links?: string;
}
