import { EnumRequestType, HandleRequest, Log, Plugin, SpeechBuilder } from 'jovo-core';
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
    Log.verbose('[CorePlatformCore] ( $init )');
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
    Log.verbose('[CorePlatformCore] ( $request )');
    if (!corePlatformApp.$host) {
      throw new Error(`Could't access host object.`);
    }

    corePlatformApp.$request = CorePlatformRequest.fromJSON(
      corePlatformApp.$host.getRequestObject(),
    ) as CorePlatformRequest;
    corePlatformApp.$user = new CorePlatformUser(corePlatformApp);
  }

  async type(corePlatformApp: CorePlatformApp) {
    Log.verbose('[CorePlatformCore] ( $type )');
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
    Log.verbose('[CorePlatformCore] ( $session )');
    const request = corePlatformApp.$request as CorePlatformRequest;
    const sessionData = request.getSessionAttributes() || {};
    corePlatformApp.$requestSessionAttributes = sessionData;
    if (!corePlatformApp.$session) {
      corePlatformApp.$session = { $data: {} };
    }
    corePlatformApp.$session.$data = sessionData;
  }

  // TODO: fully implement
  output(corePlatformApp: CorePlatformApp) {
    Log.verbose('[CorePlatformCore] ( $output )');
    const output = corePlatformApp.$output;
    if (!corePlatformApp.$response) {
      corePlatformApp.$response = new CorePlatformResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const coreResponse = corePlatformApp.$response as CorePlatformResponse;
    const tell = _get(output, 'tell');
    if (tell) {
      const tellAction: SpeechAction = {
        plain: SpeechBuilder.removeSSML(tell.speech.toString()),
        ssml: tell.speech.toString(),
        type: ActionType.Speech,
      };
      coreResponse.actions.push(tellAction);
    }

    const ask = _get(output, 'ask');
    if (ask) {
      const tellAction: SpeechAction = {
        plain: SpeechBuilder.removeSSML(ask.speech.toString()),
        ssml: ask.speech.toString(),
        type: ActionType.Speech,
      };
      const repromptAction: Action = {
        plain: SpeechBuilder.removeSSML(ask.reprompt.toString()),
        ssml: ask.reprompt.toString(),
        type: ActionType.Speech,
      };
      coreResponse.actions.push(tellAction);
      coreResponse.reprompts.push(repromptAction);
    }

    if (
      _get(corePlatformApp.$response, 'response.shouldEndSession') === false ||
      corePlatformApp.$app.config.keepSessionDataOnSessionEnded
    ) {
      if (corePlatformApp.$session && corePlatformApp.$session.$data) {
        _set(corePlatformApp.$response, 'session.data', corePlatformApp.$session.$data);
      }
    }
  }
}
