import { Jovo } from '@jovotech/framework';
import { IncomingWebhookSendArguments } from '@slack/webhook';
import { SlackPlugin, SlackPluginConfig } from './SlackPlugin';

export class JovoSlack {
  constructor(readonly slackPlugin: SlackPlugin) {}

  get config(): SlackPluginConfig {
    return this.slackPlugin.config;
  }

  sendError(error: Error, jovo?: Jovo): void {
    return this.slackPlugin.sendError(error, jovo);
  }

  sendMessage(message: string | IncomingWebhookSendArguments): void {
    return this.slackPlugin.sendMessage(message);
  }
}
