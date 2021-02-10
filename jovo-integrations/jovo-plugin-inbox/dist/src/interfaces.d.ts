import { JovoInbox } from './JovoInbox';
export declare enum InboxLogType {
    REQUEST = 0,
    RESPONSE = 1,
    ERROR = 2,
    CUSTOM = 3
}
export interface InboxLog {
    id: number;
    createdAt: Date;
    type: InboxLogType;
    appId: string;
    platform: string;
    userId: string;
    requestId: string;
    sessionId: string;
    locale: string;
    payload: any;
}
export interface JovoInboxDb {
    init(): Promise<void>;
    add(inboxLog: InboxLog): Promise<void>;
    close(): Promise<void>;
}
declare module 'jovo-core/dist/src/core/Jovo' {
    interface Jovo {
        $inbox?: JovoInbox;
    }
}
