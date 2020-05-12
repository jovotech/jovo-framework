import {
  Analytics,
  AxiosRequestConfig,
  BaseApp,
  HandleRequest,
  HttpService,
  Jovo,
  Log,
  PluginConfig,
} from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  key: string;
  appVersion: string;
}

export class ChatbaseGoogleAssistant implements Analytics {
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

    if (handleRequest.jovo.constructor.name === 'GoogleAction') {
      const data = this.createChatbaseData(handleRequest.jovo);
      this.sendDataToChatbase(data);
    }
  }

  createChatbaseData(jovo: Jovo) {
    return {
      api_key: this.config.key,
      intent: jovo.$type.type !== 'INTENT' ? jovo.$type.type : jovo.$request!.getIntentName(),
      platform: 'Actions',
      session_id: jovo.$request!.getSessionId(),
      time_stamp: Date.now(),
      type: 'user',
      user_id: jovo.$user.getId(),
      version: this.config.appVersion,
    };
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
