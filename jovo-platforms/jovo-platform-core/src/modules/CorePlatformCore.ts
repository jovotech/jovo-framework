import { EnumRequestType, HandleRequest, Plugin, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import {
  Action,
  ActionType,
  CorePlatformApp,
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformUser,
  RequestType,
  SpeechAction,
} from '..';
import { CorePlatform } from '../CorePlatform';

export class CorePlatformCore implements Plugin {
  install(platform: CorePlatform) {
    platform.middleware('$init')!.use(this.init.bind(this));
    platform.middleware('$request')!.use(this.request.bind(this));
    platform.middleware('$type')!.use(this.type.bind(this));
    platform.middleware('$session')!.use(this.session.bind(this));
    platform.middleware('$output')!.use(this.output.bind(this));
  }

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject() as CorePlatformRequest;

    if (
      requestObject.version &&
      requestObject.request &&
      requestObject.context &&
      requestObject.context.platform
    ) {
      handleRequest.jovo = new CorePlatformApp(
        handleRequest.app,
        handleRequest.host,
        handleRequest,
      );
    }
  }

  async request(corePlatformApp: CorePlatformApp) {
    if (!corePlatformApp.$host) {
      throw new Error(`Could't access host object.`);
    }

    corePlatformApp.$request = CorePlatformRequest.fromJSON(
      corePlatformApp.$host.getRequestObject(),
    ) as CorePlatformRequest;
    corePlatformApp.$user = new CorePlatformUser(corePlatformApp);
  }

  async type(corePlatformApp: CorePlatformApp) {
    const request = corePlatformApp.$request as CorePlatformRequest;
    const requestType = _get(request, 'request.type');

    let type: EnumRequestType = EnumRequestType.INTENT;

    if (requestType === RequestType.Launch) {
      type = EnumRequestType.LAUNCH;
    } else if (requestType === RequestType.End) {
      type = EnumRequestType.END;
    }

    corePlatformApp.$type = {
      type,
    };
  }

  async session(corePlatformApp: CorePlatformApp) {
    const request = corePlatformApp.$request as CorePlatformRequest;
    const sessionData = request.getSessionAttributes() || {};
    corePlatformApp.$requestSessionAttributes = sessionData;
    if (!corePlatformApp.$session) {
      corePlatformApp.$session = { $data: {} };
    }
    corePlatformApp.$session.$data = sessionData;
  }

  output(corePlatformApp: CorePlatformApp) {
    const output = corePlatformApp.$output;
    if (!corePlatformApp.$response) {
      corePlatformApp.$response = new CorePlatformResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const coreResponse = corePlatformApp.$response as CorePlatformResponse;
    if (corePlatformApp.$asr.text) {
      coreResponse.context.request.asr = { text: corePlatformApp.$asr.text };
    }
    if (
      (corePlatformApp.$nlu.intent || corePlatformApp.$nlu.inputs) &&
      !coreResponse.context.request.nlu
    ) {
      coreResponse.context.request.nlu = {};
    }
    if (corePlatformApp.$nlu.intent) {
      coreResponse.context.request.nlu!.intent = corePlatformApp.$nlu.intent;
    }
    if (corePlatformApp.$nlu.inputs) {
      coreResponse.context.request.nlu!.inputs = corePlatformApp.$nlu.inputs;
    }

    const { tell, ask } = output;

    if (tell) {
      const tellAction: SpeechAction = {
        displayText: tell.speechText,
        plain: SpeechBuilder.removeSSML(tell.speech.toString()),
        ssml: tell.speech.toString(),
        type: ActionType.Speech,
      };
      coreResponse.actions.push(tellAction);
      coreResponse.session.end = true;
    }

    if (ask) {
      const tellAction: SpeechAction = {
        displayText: ask.speechText,
        plain: SpeechBuilder.removeSSML(ask.speech.toString()),
        ssml: ask.speech.toString(),
        type: ActionType.Speech,
      };
      const repromptAction: Action = {
        displayText: ask.repromptText,
        plain: SpeechBuilder.removeSSML(ask.reprompt.toString()),
        ssml: ask.reprompt.toString(),
        type: ActionType.Speech,
      };
      coreResponse.actions.push(tellAction);
      coreResponse.reprompts.push(repromptAction);
    }

    const actions = output.CorePlatform.Actions;
    if (actions.length > 0) {
      coreResponse.actions.push(...actions);
    }

    const repromptActions = output.CorePlatform.RepromptActions;
    if (repromptActions.length > 0) {
      coreResponse.reprompts.push(...repromptActions);
    }

    if (!coreResponse.session.end || corePlatformApp.$config.keepSessionDataOnSessionEnded) {
      if (corePlatformApp.$session && corePlatformApp.$session.$data) {
        _set(corePlatformApp.$response, 'session.data', corePlatformApp.$session.$data);
      }
    }
  }
}
