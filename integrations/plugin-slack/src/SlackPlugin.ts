import {
  App,
  ArrayElement,
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
import { JovoSlack } from './JovoSlack';

export type SlackBlock = ArrayElement<Exclude<IncomingWebhookSendArguments['blocks'], undefined>>;

export interface SlackFieldMap {
  locale: boolean;
  platform: boolean;
  state: boolean;
  userId: boolean;
}

export type SlackCustomBlocksFunction = (jovo: Jovo) => SlackBlock[];

export type SlackTransformErrorFunction = (
  error: Error,
  jovo?: Jovo,
) => string | IncomingWebhookSendArguments | undefined;

export interface SlackPluginConfig extends PluginConfig {
  webhookUrl: string;
  channel: string;
  logErrors: boolean;
  fields: SlackFieldMap;
  customBlocks?: SlackCustomBlocksFunction;
  transformError?: SlackTransformErrorFunction;
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
      logErrors: true,
      fields: {
        locale: false,
        platform: true,
        state: false,
        userId: false,
      },
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
    parent.middlewareCollection.use('before.request.start', (jovo) => {
      jovo.slack = new JovoSlack(this);
    });
    parent.app.onError(this.onError);
  }

  dismount(parent: Extensible): void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.name, HandleRequest);
    }
    parent.app.removeErrorListener(this.onError);
  }

  onError = (error: Error, jovo?: Jovo): void => {
    if (!this.config.logErrors) {
      return;
    }
    this.sendError(error, jovo)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      // eslint-disable-next-line no-console
      .catch((e) => console.warn(e));
  };

  async sendError(error: Error, jovo?: Jovo): Promise<IncomingWebhookResult | undefined> {
    const sendArgs = this.getErrorSendArguments(error, jovo);
    if (!sendArgs) return;
    return this.sendMessage(sendArgs);
  }

  sendMessage(message: string | IncomingWebhookSendArguments): Promise<IncomingWebhookResult> {
    return this.client.send(message);
  }

  private getErrorSendArguments(
    error: Error,
    jovo?: Jovo,
  ): string | IncomingWebhookSendArguments | undefined {
    if (this.config.transformError) {
      return this.config.transformError(error, jovo);
    }

    return {
      channel: this.config.channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🔴 An error occurred',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error message*\n${error.message}${
              error.stack ? `\n\n*Error stack*\n \`\`\`${error.stack}\`\`\`` : ''
            }`,
          },
        },
        ...this.getBlocksFromFieldMap(jovo),
      ],
    };
  }

  getBlocksFromFieldMap(jovo?: Jovo): SlackBlock[] {
    if (!jovo) return [];
    const blocks = Object.entries(this.config.fields).reduce(
      (blocks: SlackBlock[], [key, enabled]) => {
        if (enabled) {
          const block = this.getBlockFor(key as keyof SlackFieldMap, jovo);
          if (block) {
            blocks.push(block);
          }
        }
        return blocks;
      },
      [],
    );

    const cloudWatchBlock = this.getCloudWatchBlock(jovo);
    if (cloudWatchBlock) {
      blocks.push(cloudWatchBlock);
    }

    if (this.config.customBlocks) {
      const customBlocks = this.config.customBlocks(jovo);
      if (customBlocks?.length) {
        blocks.push(...customBlocks);
      }
    }

    return blocks;
  }

  getBlockFor(key: keyof SlackFieldMap, jovo: Jovo): SlackBlock | undefined {
    if (key === 'locale') {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Locale*\n${jovo.$request.getLocale() || 'undefined'}`,
        },
      };
    }
    if (key === 'platform') {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Platform*\n${jovo.$platform.name}`,
        },
      };
    }
    if (key === 'state') {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*State*\n \`\`\`${
            jovo.$state ? JSON.stringify(jovo.$state, undefined, 2) : 'undefined'
          }\`\`\``,
        },
      };
    }
    if (key === 'userId') {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*User ID*\n${jovo.$user.id || 'undefined'}`,
        },
      };
    }
  }

  getCloudWatchBlock(jovo: Jovo): SlackBlock | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = (jovo.$server as any).context;
    if (context?.awsRequestId) {
      const region = context.invokedFunctionArn.split(':')[3]; // e.g. arn:aws:lambda:eu-west-1:820261819571:function:testName
      const baseUrl = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/`;
      const logGroup = `${context.logGroupName.replace(/\//g, '$252F')}/log-events/`;
      const logStream = `${context
        .logStreamName!.replace('$', '$2524')
        .replace('[', '$255B')
        .replace(']', '$255D')
        .replace(/\//g, '$252F')}`;
      const filterPattern = `$3FfilterPattern$3D$2522${context.awsRequestId}$2522`; // $2522 -> "
      const cloudWatchUrl = baseUrl + logGroup + logStream + filterPattern;

      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Cloudwatch URL*\n<${cloudWatchUrl}|Cloudwatch Log URL>`,
        },
      };
    }
  }
}
