import { JovoInbox } from './JovoInbox';

export enum InboxLogType {
  REQUEST,
  RESPONSE,
  ERROR,
  CUSTOM,
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
  // tslint:disable-next-line:no-any
  payload: any;
}

export interface JovoInboxDb {
  init(): Promise<void>;
  add(inboxLog: InboxLog): Promise<void>;
  close(): Promise<void>;
}

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $inbox?: JovoInbox;
  }
}
