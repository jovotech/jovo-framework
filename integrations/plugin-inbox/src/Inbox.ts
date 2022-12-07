import { Jovo } from '@jovotech/framework';
import { JovoInbox } from './JovoInbox';
import { InboxLogType } from './';

export class Inbox {
  constructor(readonly jovoInboxPlugin: JovoInbox, private jovo: Jovo) {}

  async send(payload: unknown): Promise<void> {
    const log = this.jovoInboxPlugin.buildLog(this.jovo, InboxLogType.Custom, payload);
    return this.jovoInboxPlugin.post(log);
  }

  async sendError(error: Error, printStackTrace = false): Promise<void> {
    const log = this.jovoInboxPlugin.buildLog(this.jovo, InboxLogType.Error, {
      name: error.name,
      message: error.message,
      stack: printStackTrace ? error.stack : undefined,
    });
    return this.jovoInboxPlugin.post(log);
  }
}
