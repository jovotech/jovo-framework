import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { EnumRequestType, HandleRequest } from 'jovo-core';
import { AlexaRequest } from '../core/AlexaRequest';
import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaSpeechBuilder } from '../core/AlexaSpeechBuilder';
import { AlexaUser } from '../core/AlexaUser';
import { AlexaResponse } from '../index';

export class AlexaCore implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$init')!.use(this.init.bind(this));
    alexa.middleware('$request')!.use(this.request.bind(this));
    alexa.middleware('$type')!.use(this.type.bind(this));
    alexa.middleware('$session')!.use(this.session.bind(this));
    alexa.middleware('$output')!.use(this.output.bind(this));
  }

  uninstall(alexa: Alexa) {}

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject();
    if (requestObject.version && requestObject.request && requestObject.request.requestId) {
      handleRequest.jovo = new AlexaSkill(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(alexaSkill: AlexaSkill) {
    if (!alexaSkill.$host) {
      throw new Error(`Couldn't access host object`);
    }

    alexaSkill.$request = AlexaRequest.fromJSON(
      alexaSkill.$host.getRequestObject(),
    ) as AlexaRequest;
    alexaSkill.$user = new AlexaUser(alexaSkill);
  }

  async type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (_get(alexaRequest, 'request.type') === 'LaunchRequest') {
      alexaSkill.$type = {
        type: EnumRequestType.LAUNCH,
      };
    }

    if (_get(alexaRequest, 'request.type') === 'IntentRequest') {
      alexaSkill.$type = {
        type: EnumRequestType.INTENT,
      };
    }

    if (_get(alexaRequest, 'request.type') === 'SessionEndedRequest') {
      alexaSkill.$type = {
        type: EnumRequestType.END,
      };

      if (_get(alexaRequest, 'request.reason')) {
        alexaSkill.$type.subType = _get(alexaRequest, 'request.reason');
      }
    }

    if (_get(alexaRequest, 'request.type') === 'System.ExceptionEncountered') {
      alexaSkill.$type = {
        type: EnumRequestType.ON_ERROR,
      };
    }

    if (_get(alexaRequest, 'request.type') === 'Alexa.Presentation.APL.RuntimeError') {
      alexaSkill.$type = {
        type: EnumRequestType.ON_ERROR,
      };
    }

    if (_get(alexaRequest, 'request.type') === 'Alexa.Presentation.APLA.RuntimeError') {
      alexaSkill.$type = {
        type: EnumRequestType.ON_ERROR,
      };
    }
  }

  async session(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    alexaSkill.$requestSessionAttributes = JSON.parse(
      JSON.stringify(alexaRequest.getSessionAttributes() || {}),
    );
    if (!alexaSkill.$session) {
      alexaSkill.$session = { $data: {} };
    }
    alexaSkill.$session.$data = JSON.parse(
      JSON.stringify(alexaRequest.getSessionAttributes() || {}),
    );
  }

  output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;

    if (!alexaSkill.$response) {
      alexaSkill.$response = new AlexaResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }
    const tell = _get(output, 'Alexa.tell') || _get(output, 'tell');
    if (tell) {
      _set(alexaSkill.$response, 'response.shouldEndSession', true);
      _set(alexaSkill.$response, 'response.outputSpeech', {
        type: 'SSML',
        ssml: AlexaSpeechBuilder.toSSML(tell.speech),
      });
    }
    const ask = _get(output, 'Alexa.ask') || _get(output, 'ask');

    if (ask) {
      _set(alexaSkill.$response, 'response.shouldEndSession', false);
      _set(alexaSkill.$response, 'response.outputSpeech', {
        type: 'SSML',
        ssml: AlexaSpeechBuilder.toSSML(ask.speech),
      });
      _set(alexaSkill.$response, 'response.reprompt.outputSpeech', {
        type: 'SSML',
        ssml: AlexaSpeechBuilder.toSSML(ask.reprompt),
      });
    }

    if (_get(alexaSkill.$response, 'response.shouldEndSession') === false) {
      // set sessionAttributes
      if (alexaSkill.$session && alexaSkill.$session.$data) {
        _set(alexaSkill.$response, 'sessionAttributes', alexaSkill.$session.$data);
      }
    }

    // add sessionData to response object explicitly
    if (_get(alexaSkill.$app.config, 'keepSessionDataOnSessionEnded')) {
      // set sessionAttributes
      if (alexaSkill.$session && alexaSkill.$session.$data) {
        _set(alexaSkill.$response, 'sessionAttributes', alexaSkill.$session.$data);
      }
    }

    if (_get(output, 'Alexa.Directives')) {
      _set(alexaSkill.$response, 'response.directives', _get(output, 'Alexa.Directives'));
    }

    if (_get(output, 'Alexa.deleteShouldEndSession')) {
      if (typeof _get(alexaSkill.$response, 'response.shouldEndSession') !== 'undefined') {
        delete (alexaSkill.$response as AlexaResponse).response.shouldEndSession;
      }
    }

    if (
      typeof _get(output, 'Alexa.shouldEndSession') &&
      _get(output, 'Alexa.shouldEndSession') === null
    ) {
      if (_get(alexaSkill.$response, 'response.shouldEndSession')) {
        delete (alexaSkill.$response as AlexaResponse).response.shouldEndSession;
      }
    }

    if (typeof _get(output, 'Alexa.shouldEndSession') === 'boolean') {
      (alexaSkill.$response as AlexaResponse).response.shouldEndSession = _get(
        output,
        'Alexa.shouldEndSession',
      );
    }
  }
}
