import {
  AudioData,
  AxiosResponse,
  BaseApp,
  HandleRequest,
  Host,
  Jovo,
  QuickReply as GenericQuickReply,
  SpeechBuilder,
} from 'jovo-core';
import {
  AirlineTemplate,
  AirlineTemplateOptions,
  AirlineTemplatePayload,
  AttachmentMessage,
  AttachmentMessageOptions,
  ButtonTemplate,
  ButtonTemplateOptions,
  ButtonTemplatePayload,
  DEFAULT_VERSION,
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
  SendMessageResponse,
  TemplateType,
  TextMessage,
  TextMessageOptions,
  TextQuickReply,
} from '..';
import { MessengerBotSpeechBuilder } from './MessengerBotSpeechBuilder';
import { MessengerBotUser } from './MessengerBotUser';
import _get = require('lodash.get');
import _set = require('lodash.set');

export class MessengerBot extends Jovo {
  $messengerBot: MessengerBot;

  constructor(app: BaseApp, host: Host, handleRequest: HandleRequest) {
    super(app, host, handleRequest);
    this.$messengerBot = this;
    this.$speech = new MessengerBotSpeechBuilder(this);
    this.$reprompt = new MessengerBotSpeechBuilder(this);
    this.$user = new MessengerBotUser(this);
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
    if (this.$user.$session && typeof this.$user.$session.isNew !== 'undefined') {
      return this.$user.$session.isNew;
    }
    return true;
  }

  speechBuilder(): SpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  // Output methods
  setText(text: string): this {
    _set(this.$output, 'FacebookMessenger.Overwrite.Text', text);
    return this;
  }

  private setResponses(message: any): void {
    const currentResponses = _get(this.$output, 'FacebookMessenger.responses') ?? [];
    const responses = [...currentResponses, message];
    _set(this.$output, 'FacebookMessenger.responses', responses);
  }

  showQuickReplies(quickReplies: Array<QuickReply | GenericQuickReply | string>): this {
    return this.setQuickReplies(quickReplies);
  }

  setQuickReplies(quickReplies: Array<QuickReply | GenericQuickReply | string>): this {
    const facebookQuickReplies: Array<QuickReply | string> = quickReplies.map((quickReply) => {
      return typeof quickReply === 'object' && 'value' in quickReply
        ? new TextQuickReply(quickReply.label || quickReply.value, quickReply.value)
        : quickReply;
    });
    _set(this.$output, 'FacebookMessenger.Overwrite.QuickReplies', facebookQuickReplies);
    return this;
  }

  addQuickReply(quickReply: QuickReply | GenericQuickReply | string): this {
    const quickReplies = _get(this.$output, 'FacebookMessenger.Overwrite.QuickReplies');
    quickReplies.push(
      typeof quickReply === 'object' && 'value' in quickReply
        ? new TextQuickReply(quickReply.label || quickReply.value, quickReply.value)
        : quickReply,
    );
    _set(this.$output, 'FacebookMessenger.Overwrite.QuickReplies', quickReplies);
    return this;
  }

  async showText(options: TextMessageOptions): Promise<AxiosResponse<SendMessageResponse>> {
    const message = new TextMessage({ id: this.$user.getId()! }, { ...options });
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showAttachment(
    options: AttachmentMessageOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const message = new AttachmentMessage({ id: this.$user.getId()! }, options);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showAirlineTemplate(
    options: AirlineTemplateOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const payload: AirlineTemplatePayload = {
      ...options,
      template_type: TemplateType.Airline,
    };
    const message = new AirlineTemplate({ id: this.$user.getId()! }, payload);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showButtonTemplate(
    options: ButtonTemplateOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const payload: ButtonTemplatePayload = {
      ...options,
      template_type: TemplateType.Button,
    };
    const message = new ButtonTemplate({ id: this.$user.getId()! }, payload);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showGenericTemplate(
    options: GenericTemplateOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const payload: GenericTemplatePayload = {
      ...options,
      template_type: TemplateType.Generic,
    };
    const message = new GenericTemplate({ id: this.$user.getId()! }, payload);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showMediaTemplate(
    options: MediaTemplateOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const payload: MediaTemplatePayload = {
      ...options,
      template_type: TemplateType.Media,
    };
    const message = new MediaTemplate({ id: this.$user.getId()! }, payload);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showReceiptTemplate(
    options: ReceiptTemplateOptions,
  ): Promise<AxiosResponse<SendMessageResponse>> {
    const payload: ReceiptTemplatePayload = {
      ...options,
      template_type: TemplateType.Receipt,
    };
    const message = new ReceiptTemplate({ id: this.$user.getId()! }, payload);
    this.setResponses(message);
    return message.send(this.pageAccessToken, this.version);
  }

  async showAction(action: SenderActionType): Promise<AxiosResponse<SendMessageResponse>> {
    const message = new SenderAction({ id: this.$user.getId()! }, action);
    return message.send(this.pageAccessToken, this.version);
  }

  async showTyping(delayInMs: number): Promise<void> {
    const typingOnRequest = new SenderAction(
      { id: this.$user.getId()! },
      SenderActionType.TypingOn,
    );
    const typingOffRequest = new SenderAction(
      { id: this.$user.getId()! },
      SenderActionType.TypingOff,
    );

    this.setResponses({
      typingOn: typingOnRequest,
      typingOff: typingOffRequest,
      delayInMs: delayInMs,
    });

    await typingOnRequest.send(this.pageAccessToken, this.version);
    // Remove delay when this method is being used in testing
    if (this.$host.headers['jovo-test'] !== 'true') {
      await new Promise((resolve) => setTimeout(resolve, delayInMs));
    }
    await typingOffRequest.send(this.pageAccessToken, this.version);
    return;
  }

  get version(): string {
    return _get(this.$config, 'plugin.FacebookMessenger.version', DEFAULT_VERSION);
  }

  get pageAccessToken(): string {
    return _get(this.$config, 'plugin.FacebookMessenger.pageAccessToken', '');
  }
}
