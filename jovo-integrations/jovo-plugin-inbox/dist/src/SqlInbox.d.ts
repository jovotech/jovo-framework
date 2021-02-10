import { JovoInboxDb } from './interfaces';
import { ConnectionOptions } from 'typeorm';
import { InboxLogEntity } from './entity/InboxLog';
export declare class SqlInbox implements JovoInboxDb {
    config: ConnectionOptions;
    constructor(config?: Partial<ConnectionOptions>);
    init(): Promise<void>;
    errorHandling(): void;
    add(inboxLog: InboxLogEntity): Promise<void>;
    close(): Promise<void>;
}
