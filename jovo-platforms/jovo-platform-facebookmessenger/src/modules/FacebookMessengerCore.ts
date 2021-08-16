import { EnumRequestType, HandleRequest, Plugin } from 'jovo-core';
import _get = require('lodash.get');
import {
  FacebookMessenger,
  MessengerBot,
  MessengerBotRequest,
  MessengerBotResponse,
  MessengerBotUser,
  TextMessage,
} from '..';

export class FacebookMessengerCore implements Plugin {
  private launchPayload?: string;
  private locale?: string;

  install(messenger: FacebookMessenger): void {
    this.launchPayload = messenger.config.launch!.data;
    this.locale = messenger.config.locale;

    messenger.middleware('$init')!.use(this.init.bind(this));
    messenger.middleware('$request')!.use(this.request.bind(this));
    messenger.middleware('$type')!.use(this.type.bind(this));
    messenger.middleware('$session')!.use(this.session.bind(this));
    messenger.middleware('$output')!.use(this.output.bind(this));
  }

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject();

    if (
      requestObject &&
      requestObject.id &&
      requestObject.time &&
      requestObject.messaging &&
      requestObject.messaging[0]
    ) {
      handleRequest.jovo = new MessengerBot(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(messengerBot: MessengerBot) {
    if (!messengerBot.$host) {
      throw new Error(`Couldn't access host object.`);
    }

    messengerBot.$request = MessengerBotRequest.fromJSON(messengerBot.$host.getRequestObject());
    messengerBot.$request.setLocale(this.locale!);
    messengerBot.$user = new MessengerBotUser(messengerBot);
  }

  async type(messengerBot: MessengerBot) {
    let type =
      _get(messengerBot, '$request.messaging[0].postback.payload') ?? EnumRequestType.INTENT;
    if (!!type && !!this.launchPayload && type === this.launchPayload) {
      type = EnumRequestType.LAUNCH;
    }

    messengerBot.$type = {
      type,
    };
  }

  async session(messengerBot: MessengerBot) {
    if (!messengerBot.$session) {
      messengerBot.$session = { $data: {} };
    }
    messengerBot.$session.$data = { ...messengerBot.$user.$session?.$data };
  }

  async output(messengerBot: MessengerBot) {
    const output = messengerBot.$output;
    if (!messengerBot.$response) {
      messengerBot.$response = new MessengerBotResponse();
    }

    const response = messengerBot.$response as MessengerBotResponse;

    response.message = [];

    if (Object.keys(output).length === 0) {
      return;
    }

    const setText = _get(output, 'FacebookMessenger.Overwrite.Text');
    const overWriteQuickReplies = _get(output, 'FacebookMessenger.Overwrite.QuickReplies');

    const tell = _get(output, 'tell');
    if (tell) {
      const text = setText || tell.speech.toString();
      response.message.push(
        new TextMessage(
          { id: messengerBot.$user.getId()! },
          { text, quickReplies: overWriteQuickReplies },
        ),
      );
    }

    const ask = _get(output, 'ask');
    if (ask) {
      const text = setText || ask.speech.toString();
      response.message.push(
        new TextMessage(
          { id: messengerBot.$user.getId()! },
          { text, quickReplies: overWriteQuickReplies },
        ),
      );
    }

    const responses = _get(output, 'FacebookMessenger.responses');
    if (responses && responses.length) {
      response.message = [...response.message, ...responses];
    }
  }
}
