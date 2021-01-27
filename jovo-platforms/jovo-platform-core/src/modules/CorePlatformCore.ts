import {
  AskOutput,
  EnumRequestType,
  HandleRequest,
  Host,
  Plugin,
  SpeechBuilder,
  TellOutput,
} from 'jovo-core';
import {
  Action,
  ActionType,
  CorePlatformApp,
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformUser,
  RequestType,
  SpeechAction,
  TextAction,
} from '..';
import { CorePlatform } from '../CorePlatform';
import _get = require('lodash.get');
import _set = require('lodash.set');

export class CorePlatformCore implements Plugin {
  // Bind before and set as variable in order to be able to properly remove the fns
  protected initFn = this.init.bind(this);
  protected requestFn = this.request.bind(this);
  protected typeFn = this.type.bind(this);
  protected sessionFn = this.session.bind(this);
  protected outputFn = this.output.bind(this);

  install(platform: CorePlatform) {
    platform.middleware('$init')!.use(this.initFn);
    platform.middleware('$request')!.use(this.requestFn);
    platform.middleware('$type')!.use(this.typeFn);
    platform.middleware('$session')!.use(this.sessionFn);
    platform.middleware('$output')!.use(this.outputFn);
  }

  uninstall(platform?: CorePlatform) {
    platform?.middleware('$init')!.remove(this.initFn);
    platform?.middleware('$request')!.remove(this.requestFn);
    platform?.middleware('$type')!.remove(this.typeFn);
    platform?.middleware('$session')!.remove(this.sessionFn);
    platform?.middleware('$output')!.remove(this.outputFn);
  }

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject() as CorePlatformRequest;

    if (this.isCoreRequest(requestObject) && requestObject.type === 'jovo-platform-core') {
      handleRequest.jovo = new CorePlatformApp(
        handleRequest.app,
        handleRequest.host,
        handleRequest,
      );
    }
  }

  async request(corePlatformApp: CorePlatformApp) {
    if (!corePlatformApp.$host) {
      throw new Error(`Couldn't access host object.`);
    }

    this.overwriteRequestAudioData(corePlatformApp.$host);

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

    const platformType = this.getPlatformType();
    const defaultOutputAction =
      corePlatformApp.$config.plugin?.[platformType]?.defaultOutputAction || ActionType.Speech;

    const actionFromSpeech: (tellOrAsk: TellOutput | AskOutput) => TextAction | SpeechAction = (
      tellOrAsk: TellOutput | AskOutput,
    ) => {
      return defaultOutputAction === ActionType.Speech
        ? {
            displayText: tellOrAsk.speechText,
            plain: SpeechBuilder.removeSSML(tellOrAsk.speech.toString()),
            ssml: SpeechBuilder.toSSML(tellOrAsk.speech.toString()),
            type: ActionType.Speech,
          }
        : {
            text: tellOrAsk.speechText || tellOrAsk.speech.toString(),
            type: ActionType.Text,
          };
    };

    const { tell, ask } = output;

    if (tell) {
      coreResponse.actions.push(actionFromSpeech(tell));
      coreResponse.session.end = true;
    }

    if (ask) {
      coreResponse.actions.push(actionFromSpeech(ask));

      if (defaultOutputAction === ActionType.Speech) {
        const repromptAction: Action = {
          displayText: ask.repromptText,
          plain: SpeechBuilder.removeSSML(ask.reprompt.toString()),
          ssml: SpeechBuilder.toSSML(ask.reprompt.toString()),
          type: ActionType.Speech,
        };
        coreResponse.reprompts.push(repromptAction);
      }
    }

    const actions = output[platformType]?.Actions;
    if (actions?.length) {
      coreResponse.actions.push(...actions);
    }

    const repromptActions = output[platformType]?.RepromptActions;
    if (repromptActions?.length) {
      coreResponse.reprompts.push(...repromptActions);
    }

    if (!coreResponse.session.end || corePlatformApp.$config.keepSessionDataOnSessionEnded) {
      if (corePlatformApp.$session && corePlatformApp.$session.$data) {
        _set(corePlatformApp.$response, 'session.data', corePlatformApp.$session.$data);
      }
    }
  }

  protected getPlatformType(): 'CorePlatform' | string {
    return 'CorePlatform';
  }

  protected isCoreRequest(request: any): boolean {
    return request.version && request.type && request.request?.type;
  }

  protected overwriteRequestAudioData(host: Host) {
    const audioBase64String = host.$request?.request?.body?.audio?.b64string;
    if (audioBase64String) {
      const samples = this.getSamplesFromAudio(audioBase64String);
      _set(host.$request, 'request.body.audio.data', samples);
    }
  }

  protected getSamplesFromAudio(base64: string): Float32Array {
    const binaryBuffer = Buffer.from(base64, 'base64').toString('binary');
    const length = binaryBuffer.length / Float32Array.BYTES_PER_ELEMENT;
    const view = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
    const samples = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const p = i * 4;
      view.setUint8(0, binaryBuffer.charCodeAt(p));
      view.setUint8(1, binaryBuffer.charCodeAt(p + 1));
      view.setUint8(2, binaryBuffer.charCodeAt(p + 2));
      view.setUint8(3, binaryBuffer.charCodeAt(p + 3));
      samples[i] = view.getFloat32(0, true);
    }
    return samples;
  }
}
