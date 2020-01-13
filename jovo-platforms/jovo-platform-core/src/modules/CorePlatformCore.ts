import { EnumRequestType, HandleRequest, Log, Plugin, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { CorePlatformApp, CorePlatformRequest, CorePlatformResponse, CorePlatformUser } from '..';
import { CorePlatform } from '../CorePlatform';

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
    const requestObject = handleRequest.host.getRequestObject();

    if (requestObject && requestObject.request && requestObject.$version) {
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

    let type: EnumRequestType = EnumRequestType.INTENT;
    if (request.isLaunch) {
      type = EnumRequestType.LAUNCH;
    } else if (request.isEnd) {
      type = EnumRequestType.END;
    }

    corePlatformApp.$type = {
      type,
    };
  }

  async session(corePlatformApp: CorePlatformApp) {
    Log.verbose('[CorePlatformCore] ( $session )');
    const request = corePlatformApp.$request as CorePlatformRequest;
    const sessionData = JSON.parse(JSON.stringify(request.getSessionAttributes() || {}));
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
      const tellObj = {
        speech: {
          ssml: SpeechBuilder.toSSML(tell.speech.toString()),
          text: _get(output, 'text.speech', ''),
        },
      };

      _set(corePlatformApp.$response, 'response.shouldEndSession', true);
      _set(corePlatformApp.$response, 'response.output', tellObj);
    }

    const ask = _get(output, 'ask');
    if (ask) {
      const askObj: any = {
        speech: {
          ssml: SpeechBuilder.toSSML(ask.speech.toString()),
          text: _get(output, 'text.speech', ''),
        },
      };
      if (ask.reprompt) {
        askObj.reprompt = {
          ssml: SpeechBuilder.toSSML(ask.reprompt.toString()),
          text: _get(output, 'text.reprompt', ''),
        };
      }

      _set(corePlatformApp.$response, 'response.shouldEndSession', false);
      _set(corePlatformApp.$response, 'response.output', askObj);
    }

    const actions = _get(output, 'actions');
    if (actions) {
      _set(corePlatformApp.$response, 'response.output.actions', actions);
    }

    if (corePlatformApp.getRawText()) {
      _set(corePlatformApp.$response, 'response.inputText', corePlatformApp.getRawText());
    }

    if (
      _get(corePlatformApp.$response, 'response.shouldEndSession') === false ||
      corePlatformApp.$app.config.keepSessionDataOnSessionEnded
    ) {
      // set sessionAttributes
      if (corePlatformApp.$session && corePlatformApp.$session.$data) {
        _set(corePlatformApp.$response, 'sessionData', corePlatformApp.$session.$data);
      }
    }
  }
}
