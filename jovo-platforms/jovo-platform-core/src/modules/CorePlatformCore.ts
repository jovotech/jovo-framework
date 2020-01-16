import { EnumRequestType, HandleRequest, Log, Plugin, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { CorePlatformApp, CorePlatformRequest, CorePlatformResponse, CorePlatformUser } from '..';
import { RequestType } from '../core/CorePlatformRequest';
import { ActionType, Reprompt, SpeechAction } from '../core/CorePlatformResponse';
import { CorePlatform } from '../CorePlatform';

// TODO refactor to work with new request
export class CorePlatformCore implements Plugin {
  install(platform: CorePlatform) {
    platform.middleware('$init')!.use(this.init.bind(this));
    platform.middleware('$request')!.use(this.request.bind(this));
    platform.middleware('$type')!.use(this.type.bind(this));
    platform.middleware('$session')!.use(this.session.bind(this));
    platform.middleware('$tts.before')!.use(this.beforeTTS.bind(this));
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

  beforeTTS(corePlatformApp: CorePlatformApp) {
    const tell = _get(corePlatformApp.$output, 'tell');
    if (tell) {
      corePlatformApp.$output.text = {
        reprompt: '',
        speech: SpeechBuilder.removeSSML(tell.speech.toString()),
      };
    }

    const ask = _get(corePlatformApp.$output, 'ask');
    if (ask) {
      corePlatformApp.$output.text = {
        reprompt: SpeechBuilder.removeSSML(ask.reprompt.toString()),
        speech: SpeechBuilder.removeSSML(ask.speech.toString()),
      };
    }
  }

  // TODO: refactor
  output(corePlatformApp: CorePlatformApp) {
    Log.verbose('[CorePlatformCore] ( $output )');
    const output = corePlatformApp.$output;
    if (!corePlatformApp.$response) {
      corePlatformApp.$response = new CorePlatformResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = _get(output, 'tell');
    if (tell) {
      const action: SpeechAction = {
        plain: SpeechBuilder.removeSSML(tell.speech.toString()),
        ssml: tell.speech.toString(),
        type: ActionType.Speech,
      };

      (corePlatformApp.$response as CorePlatformResponse).actions.push(action);
    }

    const ask = _get(output, 'ask');
    if (ask) {
      const action: SpeechAction = {
        plain: SpeechBuilder.removeSSML(ask.speech.toString()),
        ssml: ask.speech.toString(),
        type: ActionType.Speech,
      };
      const reprompt: Reprompt = {
        actions: [
          {
            plain: SpeechBuilder.removeSSML(ask.reprompt.toString()),
            ssml: ask.reprompt.toString(),
            type: ActionType.Speech,
          },
        ],
        type: ActionType.SequenceContainer,
      };

      (corePlatformApp.$response as CorePlatformResponse).actions.push(action);
      (corePlatformApp.$response as CorePlatformResponse).reprompts.push(reprompt);
    }

    const actions = _get(output, 'actions');
    if (actions) {
      _set(corePlatformApp.$response, 'response.actions', actions);
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
