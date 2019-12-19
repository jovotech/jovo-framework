import {
  Analytics,
  AxiosRequestConfig,
  BaseApp,
  HandleRequest,
  HttpService,
  Inputs,
  Jovo,
  Log,
  PluginConfig,
} from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  key: string;
  appVersion: string;
}

export class ChatbaseAlexa implements Analytics {
  config: Config = {
    appVersion: '',
    key: '',
  };

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    app.on('response', this.track);
  }

  uninstall(app: BaseApp) {
    app.removeListener('response', this.track);
  }

  track(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return;
    }

    if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
      const data = this.createChatbaseData(handleRequest.jovo);
      this.sendDataToChatbase(data);
    }
  }

  createChatbaseData(jovo: Jovo) {
    const outputSpeech = jovo.$response!.getSpeech();
    const responseMessage = outputSpeech!.replace(/<[^>]*>/g, '');
    const timeStamp = Date.parse(jovo.$request!.getTimestamp());

    return this.buildMessages(
      jovo,
      timeStamp,
      jovo.$request!.toJSON().session.sessionId,
      responseMessage,
    );
  }

  buildMessages(jovo: Jovo, timeStamp: number, sessionId: string, responseMessage: string) {
    const userId = jovo.$request!.getUserId();

    return {
      messages: [
        this.buildUserMessage(jovo, userId, timeStamp, sessionId),
        this.buildAgentMessage(userId, responseMessage, sessionId),
      ],
    };
  }

  buildAgentMessage(userId: string, message: string, sessionId: string) {
    return {
      api_key: this.config.key,
      message,
      platform: 'Alexa',
      session_id: sessionId,
      time_stamp: Date.now(),
      type: 'agent',
      user_id: userId,
      version: this.config.appVersion,
    };
  }

  buildUserMessage(jovo: Jovo, userId: string, timeStamp: number, sessionId: string) {
    const unhandledRx = /Unhandled$/;
    const intentSlots = jovo.$inputs;
    let intentName = '';
    let message = '';

    const notHandled = unhandledRx.test(jovo.$plugins.Router.route.path);

    if (jovo.$type.type === 'INTENT') {
      intentName = notHandled
        ? jovo.$request!.toJSON().request.intent.name
        : jovo.$plugins.Router.route.path;

      message = this.buildMessage(intentName, intentSlots);
    } else {
      intentName = jovo.$type.type!;
    }

    return {
      api_key: this.config.key,
      intent: intentName,
      message,
      not_handled: notHandled,
      platform: 'Alexa',
      session_id: sessionId,
      time_stamp: timeStamp,
      type: 'user',
      user_id: userId,
      version: this.config.appVersion,
    };
  }

  buildMessage(intentName: string, intentSlots: Inputs) {
    const messageElements = [intentName];
    if (intentSlots) {
      const slots = this.buildMessageSlotString(intentSlots);
      if (slots.length) {
        messageElements.push(slots);
      }
    }
    return messageElements.join('\n');
  }

  /**
   * Takes an Inputs object, and converts it into a readable string for analtyics
   * @param intentSlots All of the slots passed to the intent
   */
  buildMessageSlotString(intentSlots: Inputs): string {
    const slots = [];
    for (const name in intentSlots) {
      if (intentSlots[name] !== undefined) {
        slots.push(`${name}: ${intentSlots[name]}`);
      }
    }
    return slots.join('\n').trim();
  }

  sendDataToChatbase(data: Record<string, any>) {
    const multiple = typeof data.messages !== 'undefined';

    const config: AxiosRequestConfig = {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `https://chatbase.com/api/message${multiple ? 's' : ''}`,
    };

    return HttpService.request(config).catch((e) => {
      Log.error('Error while logging to Chatbase Services');
      Log.error(e);
    });
  }
}
