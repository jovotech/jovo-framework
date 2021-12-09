import { Jovo } from '@jovotech/framework';
import { IncomingWebhookResult, IncomingWebhookSendArguments } from '@slack/webhook';
import { SlackPlugin, SlackPluginConfig } from './SlackPlugin';

export class JovoSlack {
  constructor(readonly slackPlugin: SlackPlugin) {}

  get config(): SlackPluginConfig {
    return this.slackPlugin.config;
  }

  sendError(error: Error, jovo?: Jovo): Promise<IncomingWebhookResult | undefined> {
    return this.slackPlugin.sendError(error, jovo);
  }

  sendMessage(message: string | IncomingWebhookSendArguments): Promise<IncomingWebhookResult> {
    return this.slackPlugin.sendMessage(message);
  }
}
