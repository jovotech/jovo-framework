import { EnumRequestType, HandleRequest, Plugin } from 'jovo-core';
import { SapCai } from '../SapCai';
import { SapCaiRequest, SapCaiResponse, SapCaiSkill } from '..';
import { SapCaiUser } from '../core/SapCaiUser';
import _get = require('lodash.get');
import _set = require('lodash.set');

export class SapCaiCore implements Plugin {
  install(cai: SapCai) {
    cai.middleware('$init')!.use(this.init.bind(this));
    cai.middleware('$request')!.use(this.request.bind(this));
    cai.middleware('$type')!.use(this.type.bind(this));
    cai.middleware('$session')!.use(this.session.bind(this));
    cai.middleware('$output')!.use(this.output.bind(this));
  }

  uninstall(cai: SapCai) {}

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject();

    //TODO improve check (maybe other platforms also use 'npl'.)
    if (requestObject && requestObject.nlp) {
      handleRequest.jovo = new SAPCAISkill(handleRequest.app, handleRequest.host, handleRequest);
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
    // TODO correct type-handling!
    const request = caiSkill.$request as SapCaiRequest;
    caiSkill.$type = {
      type: EnumRequestType.INTENT,
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
      caiSkill.$response = new SAPCAIResponse();
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
}
