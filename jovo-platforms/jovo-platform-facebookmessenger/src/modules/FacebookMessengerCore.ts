import { EnumRequestType, HandleRequest, Plugin, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import {
  FacebookMessenger,
  MessengerBot,
  MessengerBotRequest,
  MessengerBotResponse,
  MessengerBotUser,
  TextMessage,
} from '..';

// TODO implement session-data
export class FacebookMessengerCore implements Plugin {
  private launchPayload?: string;

  install(messenger: FacebookMessenger): void {
    this.launchPayload = messenger.config.launch!.data;

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
      _set(handleRequest.jovo.$output, 'FacebookMessenger.Messages', []);
    }
  }

  async request(messengerBot: MessengerBot) {
    if (!messengerBot.$host) {
      throw new Error(`Couldn't access host object.`);
    }

    messengerBot.$request = MessengerBotRequest.fromJSON(messengerBot.$host.getRequestObject());
    messengerBot.$user = new MessengerBotUser(messengerBot);
  }

  async type(messengerBot: MessengerBot) {
    let type: EnumRequestType = EnumRequestType.INTENT;

    const payload = _get(messengerBot, '$request.messaging[0].postback.payload');
    if (!!payload && !!this.launchPayload && payload === this.launchPayload) {
      type = EnumRequestType.LAUNCH;
    }

    messengerBot.$type = {
      type,
    };
  }

  async session(messengerBot: MessengerBot) {
    if(!messengerBot.$session) {
      messengerBot.$session = {$data: {}};
    }
    messengerBot.$session.$data = {...messengerBot.$user.$sessionData};
  }

  async output(messengerBot: MessengerBot) {
    const output = messengerBot.$output;
    if (!messengerBot.$response) {
      messengerBot.$response = new MessengerBotResponse();
    }

    const response = messengerBot.$response as MessengerBotResponse;

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = _get(output, 'tell');
    if (tell) {
      const text = new TextMessage(
        { id: messengerBot.$user.getId()! },
        { text: SpeechBuilder.removeSSML(tell.speech.toString()) },
      );
      response.messages.push(text);
    }

    const ask = _get(output, 'ask');
    if (ask) {
      const text = new TextMessage(
        { id: messengerBot.$user.getId()! },
        { text: SpeechBuilder.removeSSML(ask.speech.toString()) },
      );
      response.messages.push(text);
    }

    const messages = _get(output, 'FacebookMessenger.Messages');
    if (messages && messages.length > 0) {
      response.messages.push(...messages);
    }

  }
}
