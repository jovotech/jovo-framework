import { EnumRequestType, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import { SapCai } from '../SapCai';
import { NEW_SESSION_KEY, SapCaiRequest, SapCaiResponse, SapCaiSkill, SapCaiUser } from '..';
import _get = require('lodash.get');
import _set = require('lodash.set');

class Config implements PluginConfig {
  enabled?: boolean;
  useLaunch?: boolean;
}

export class SapCaiCore implements Plugin {
  config: Config = {
    enabled: true,
    useLaunch: true,
  };

  install(cai: SapCai) {
    this.config.useLaunch = cai.config.useLaunch;

    cai.middleware('$init')!.use(this.init.bind(this));
    cai.middleware('$request')!.use(this.request.bind(this));
    cai.middleware('$type')!.use(this.type.bind(this));
    cai.middleware('$session')!.use(this.session.bind(this));
    cai.middleware('$output')!.use(this.output.bind(this));
    cai.middleware('$response')!.use(this.response.bind(this));
  }

  uninstall(cai: SapCai) {}

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject();

    if (
      requestObject &&
      requestObject.nlp &&
      requestObject.conversation &&
      requestObject.conversation.id
    ) {
      handleRequest.jovo = new SapCaiSkill(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(caiSkill: SapCaiSkill) {
    if (!caiSkill.$host) {
      throw new Error(`Couldn't access host object`);
    }

    caiSkill.$request = SapCaiRequest.fromJSON(caiSkill.$host.getRequestObject()) as SapCaiRequest;
    caiSkill.$user = new SapCaiUser(caiSkill);
  }

  async type(caiSkill: SapCaiSkill) {
    const request = caiSkill.$request as SapCaiRequest;
    const sessionAttributes = request.getSessionAttributes();

    let type = EnumRequestType.INTENT;

    if (
      this.config.useLaunch &&
      sessionAttributes &&
      (typeof sessionAttributes[NEW_SESSION_KEY] === 'undefined' ||
        sessionAttributes[NEW_SESSION_KEY] === true)
    ) {
      type = EnumRequestType.LAUNCH;
    }
    caiSkill.$type = {
      type,
    };
  }

  async session(caiSkill: SapCaiSkill) {
    const request = caiSkill.$request as SapCaiRequest;
    const sessionData = JSON.parse(JSON.stringify(request.getSessionAttributes() || {}));
    caiSkill.$requestSessionAttributes = sessionData;
    if (!caiSkill.$session) {
      caiSkill.$session = { $data: {} };
    }
    caiSkill.$session.$data = sessionData;
  }

  output(caiSkill: SapCaiSkill) {
    const output = caiSkill.$output;

    if (!caiSkill.$response) {
      caiSkill.$response = new SapCaiResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = _get(output, 'SapCai.tell') || _get(output, 'tell');
    if (tell) {
      _set(caiSkill.$response, 'replies', [
        {
          type: 'text',
          content: tell.speech,
        },
      ]);
    }

    const ask = _get(output, 'SapCai.ask') || _get(output, 'ask');
    if (ask) {
      _set(caiSkill.$response, 'replies', [
        {
          type: 'text',
          content: ask.speech,
        },
      ]);
    }

    if (caiSkill.$session && caiSkill.$session.$data) {
      _set(caiSkill.$response, 'conversation.memory', caiSkill.$session.$data);
    }
  }

  async response(caiSkill: SapCaiSkill) {
    if (caiSkill.$type.type === EnumRequestType.LAUNCH) {
      const response = caiSkill.$response || new SapCaiResponse();
      const sessionAttributes = response.getSessionAttributes() || {};
      sessionAttributes[NEW_SESSION_KEY] = false;
      response.setSessionAttributes(sessionAttributes);
    }
  }
}
