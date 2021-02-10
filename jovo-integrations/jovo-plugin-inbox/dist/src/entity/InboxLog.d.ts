import { InboxLog, InboxLogType } from '../interfaces';
export declare class InboxLogEntity implements InboxLog {
    id: number;
    createdAt: Date;
    type: InboxLogType;
    appId: string;
    userId: string;
    platform: string;
    sessionId: string;
    requestId: string;
    locale: string;
    payload: any;
}
