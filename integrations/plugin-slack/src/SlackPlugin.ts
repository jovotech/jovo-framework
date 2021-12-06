import {
  App,
  DeepPartial,
  Extensible,
  HandleRequest,
  InvalidParentError,
  Jovo,
  Plugin,
  PluginConfig,
} from '@jovotech/framework';
import {
  IncomingWebhook,
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from '@slack/webhook';

// TODO implement customization of the error / notifications in general
// Allow disabling of error propagation
export interface SlackPluginConfig extends PluginConfig {
  webhookUrl: string;
  channel: string;
  transformError?: (error: Error, jovo?: Jovo) => IncomingWebhookSendArguments;
}

export type SlackPluginInitConfig = DeepPartial<SlackPluginConfig> &
  Pick<SlackPluginConfig, 'webhookUrl' | 'channel'>;

export class SlackPlugin extends Plugin<SlackPluginConfig> {
  private client: IncomingWebhook;

  constructor(config: SlackPluginInitConfig) {
    super(config);
    this.client = new IncomingWebhook(config.webhookUrl);
  }

  getDefaultConfig(): SlackPluginConfig {
    return {
      webhookUrl: '',
      channel: '',
    };
  }

  install(parent: Extensible): void {
    if (!(parent instanceof App)) {
      throw new InvalidParentError(this.name, App);
    }
  }

  mount(parent: Extensible): void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.name, HandleRequest);
    }
    parent.app.onError(this.onError);
  }

  dismount(parent: Extensible): void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.name, HandleRequest);
    }
    parent.app.removeErrorListener(this.onError);
  }

  onError = (error: Error, jovo?: Jovo): void => {
    this.sendError(error, jovo)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      // eslint-disable-next-line no-console
      .catch((e) => console.warn(e));
  };

  sendError(error: Error, jovo?: Jovo): Promise<IncomingWebhookResult> {
    return this.sendNotification(this.getErrorSendArguments(error, jovo));
  }

  sendNotification(message: string | IncomingWebhookSendArguments): Promise<IncomingWebhookResult> {
    return this.client.send(message);
  }

  private getErrorSendArguments(error: Error, jovo?: Jovo): IncomingWebhookSendArguments {
    if (this.config.transformError) {
      return this.config.transformError(error, jovo);
    }
    // TODO implement default filling
    return {
      channel: this.config.channel,
      attachments: [
        {
          fallback: 'An error has occurred.',
          color: '#ff0000',
          pretext: '',
          author_name: '',
          author_link: '',
          author_icon: '',
          title: 'An error has occurred.',
          title_link: '',
          text: error.message,
          image_url: '',
          thumb_url: '',
          footer: 'Jovo Slack Plugin',
          footer_icon: '',
          fields: [],
        },
      ],
    };
  }
}
