import { EnumLike } from '@jovotech/framework';
import { JovoInboxConfig, JovoInbox } from './JovoInbox';
import { Inbox } from './Inbox';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    JovoInboxPlugin?: JovoInboxConfig;
  }

  interface ExtensiblePlugins {
    JovoInboxPlugin?: JovoInbox;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $inbox: Inbox;
  }
}

export enum InboxLogType {
  Request = 'request',
  Response = 'response',
  Asr = 'asr',
  Input = 'input',
  Output = 'output',
  State = 'state',
  Nlu = 'nlu',
  Error = 'error',
  User = 'user',
  Session = 'session',
  Custom = 'custom',
}

export type InboxLogTypeLike = EnumLike<InboxLogType> | string;

export interface InboxLog {
  createdAt: Date;
  type: InboxLogTypeLike;
  projectId: string;
  platform: string;
  userId: string;
  requestId: string;
  sessionId: string;
  locale: string;
  payload: unknown;
}

export * from './JovoInbox';
export * from './Inbox';
