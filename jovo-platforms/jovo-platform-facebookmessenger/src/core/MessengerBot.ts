import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import {
  AirlineTemplate,
  AirlineTemplateOptions,
  AirlineTemplatePayload,
  AttachmentMessage,
  AttachmentMessageOptions,
  ButtonTemplate,
  ButtonTemplateOptions,
  ButtonTemplatePayload,
  GenericTemplate,
  GenericTemplateOptions,
  GenericTemplatePayload,
  MediaTemplate,
  MediaTemplateOptions,
  MediaTemplatePayload,
  QuickReply,
  ReceiptTemplate,
  ReceiptTemplateOptions,
  ReceiptTemplatePayload,
  SenderAction,
  SenderActionType,
  TemplateType,
  TextMessage,
  TextMessageOptions,
} from '..';
import { MessengerBotSpeechBuilder } from './MessengerBotSpeechBuilder';
import { MessengerBotUser } from './MessengerBotUser';

export class MessengerBot extends Jovo {
  $messengerBot: MessengerBot;

  constructor(app: BaseApp, host: Host, handleRequest: HandleRequest) {
    super(app, host, handleRequest);
    this.$messengerBot = this;
    this.$speech = new MessengerBotSpeechBuilder(this);
    this.$reprompt = new MessengerBotSpeechBuilder(this);
    this.$user = new MessengerBotUser(this);
    _set(this.$output, 'FacebookMessenger.Messages', []);
  }

  getDeviceId(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return this.$request ? this.$request.getLocale() : 'en-US';
  }

  getPlatformType(): string {
    return 'FacebookMessenger';
  }

  getRawText(): string | undefined {
    return (
      _get(this, '$request.messaging[0].message.text') ||
      _get(this, '$request.messaging[0].postback.title')
    );
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }

  getSelectedElementId(): string | undefined {
    return undefined;
  }

  getSpeechBuilder(): SpeechBuilder | undefined {
    return new MessengerBotSpeechBuilder(this);
  }

  getTimestamp(): string | undefined {
    return this.$request ? this.$request.getTimestamp() : undefined;
  }

  getType(): string | undefined {
    return 'MessengerBot';
  }

  hasAudioInterface(): boolean {
    return false;
  }

  hasScreenInterface(): boolean {
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  isNewSession(): boolean {
    return this.$user.isNew();
  }

  speechBuilder(): SpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  // Output methods
  overwriteText(text: string): MessengerBot {
    _set(this.$output.FacebookMessenger, 'Overwrite.Text', text);
    return this;
  }

  overwriteQuickReplies(quickReplies: QuickReply[]): MessengerBot {
    _set(this.$output.FacebookMessenger, 'Overwrite.QuickReplies', quickReplies);
    return this;
  }

  text(options: TextMessageOptions): MessengerBot {
    const message = new TextMessage({ id: this.$user.getId()! }, { ...options });
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  attachment(options: AttachmentMessageOptions): MessengerBot {
    const message = new AttachmentMessage({ id: this.$user.getId()! }, options);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  airlineTemplate(options: AirlineTemplateOptions): MessengerBot {
    const payload: AirlineTemplatePayload = {
      ...options,
      template_type: TemplateType.Airline,
    };
    const message = new AirlineTemplate({ id: this.$user.getId()! }, payload);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  buttonTemplate(options: ButtonTemplateOptions): MessengerBot {
    const payload: ButtonTemplatePayload = {
      ...options,
      template_type: TemplateType.Button,
    };
    const message = new ButtonTemplate({ id: this.$user.getId()! }, payload);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  genericTemplate(options: GenericTemplateOptions): MessengerBot {
    const payload: GenericTemplatePayload = {
      ...options,
      template_type: TemplateType.Generic,
    };
    const message = new GenericTemplate({ id: this.$user.getId()! }, payload);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  mediaTemplate(options: MediaTemplateOptions): MessengerBot {
    const payload: MediaTemplatePayload = {
      ...options,
      template_type: TemplateType.Media,
    };
    const message = new MediaTemplate({ id: this.$user.getId()! }, payload);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  receiptTemplate(options: ReceiptTemplateOptions): MessengerBot {
    const payload: ReceiptTemplatePayload = {
      ...options,
      template_type: TemplateType.Receipt,
    };
    const message = new ReceiptTemplate({ id: this.$user.getId()! }, payload);
    this.$output.FacebookMessenger.Messages.push(message);
    return this;
  }

  async action(action: SenderActionType): Promise<boolean> {
    const message = new SenderAction({ id: this.$user.getId()! }, action);

    const pageAccessToken = _get(this.$config, 'plugin.FacebookMessenger.pageAccessToken', '');
    const result = await message.send(pageAccessToken);
    return !!result;
  }
}
