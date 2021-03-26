import { Google } from 'dashbot';
import { Analytics, BaseApp, HandleRequest, Log, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import * as dashbot from 'dashbot'; // tslint:disable-line

export interface Config extends PluginConfig {
  key: string;
}

export class DashbotGoogleAssistantConversations implements Analytics {
  config: Config = {
    key: '',
  };
  dashbot!: Google;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    // @ts-ignore
    this.dashbot = dashbot(this.config.key, { debug: true }).google;
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
      try {
        const requestObj = { ...handleRequest.host.getRequestObject() };

        this.dashbot.logIncoming({
          fulfillmentLib: '@assistant/conversation',
          request: requestObj,
        });
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }

      const responseObj = { ...handleRequest.jovo.$response };
      _set(
        responseObj,
        'user.params.dashbot',
        JSON.stringify({
          dashbotUser: {
            userId: handleRequest.jovo.$user.getId(),
          },
        }),
      );
      try {
        this.dashbot.logOutgoing(
          {
            fulfillmentLib: '@assistant/conversation',
            request: handleRequest.host.getRequestObject(),
          },
          { response: { body: responseObj }, fulfillmentLib: '@assistant/conversation' },
        );
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }
    }
  }
}
