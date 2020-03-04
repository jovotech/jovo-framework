import {
  Plugin,
  HandleRequest,
  JovoError,
  ErrorCode,
  EnumRequestType,
} from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
import { AutopilotRequest } from '../core/AutopilotRequest';
import { AutopilotResponse } from '../core/AutopilotResponse';
import { AutopilotUser } from '../core/AutopilotUser';
import { AutopilotSpeechBuilder } from '../core/AutopilotSpeechBuilder';

export class AutopilotCore implements Plugin {
  install(autopilot: Autopilot) {
    autopilot.middleware('$init')!.use(this.init.bind(this));
    autopilot.middleware('$request')!.use(this.request.bind(this));
    autopilot.middleware('$type')!.use(this.type.bind(this));
    autopilot.middleware('$session')!.use(this.session.bind(this));
    autopilot.middleware('$output')!.use(this.output.bind(this));
  }

  uninstall(autopilot: Autopilot) {}

  async init(handleRequest: HandleRequest) {
    const requestObject = handleRequest.host.getRequestObject();
    if (
      requestObject.DialogueSid &&
      requestObject.AccountSid &&
      requestObject.AssistantSid &&
      requestObject.UserIdentifier
    ) {
      handleRequest.jovo = new AutopilotBot(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(autopilotBot: AutopilotBot) {
    if (!autopilotBot.$host) {
      throw new JovoError(
        "Couldn't access $host object",
        ErrorCode.ERR_PLUGIN,
        'jovo-platform-twilioautopilot',
        'The $host object is necessary to initialize both $request and $user',
      );
    }

    autopilotBot.$request = AutopilotRequest.fromJSON(
      autopilotBot.$host.getRequestObject(),
    ) as AutopilotRequest;
    autopilotBot.$user = new AutopilotUser(autopilotBot);
  }

  async type(autopilotBot: AutopilotBot) {
    const autopilotRequest = autopilotBot.$request as AutopilotRequest;

    if (autopilotRequest.getIntentName() === 'greeting') {
      // intent by default in every project that has "hello" etc. as utterance
      autopilotBot.$type = {
        type: EnumRequestType.LAUNCH,
      };
    } else if (autopilotRequest.getIntentName() === 'goodbye') {
      autopilotBot.$type = {
        type: EnumRequestType.END,
      };
    } else {
      autopilotBot.$type = {
        type: EnumRequestType.INTENT,
      };
    }
  }

  async session(autopilotBot: AutopilotBot) {
    const autopilotRequest = autopilotBot.$request as AutopilotRequest;
    autopilotBot.$requestSessionAttributes = autopilotRequest.getSessionData();
    if (!autopilotBot.$session) {
      autopilotBot.$session = { $data: {} };
    }
    autopilotBot.$session.$data = autopilotRequest.getSessionData();
  }

  async output(autopilotBot: AutopilotBot) {
    const output = autopilotBot.$output;
    const response = autopilotBot.$response as AutopilotResponse;

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = output.tell;
    if (tell) {
      const sayAction = {
        say: AutopilotSpeechBuilder.toSSML(tell.speech as string),
      };
      response.actions.unshift(sayAction);
    }

    const ask = output.ask;
    if (ask) {
      const sayAction = {
        say: AutopilotSpeechBuilder.toSSML(ask.speech as string),
      };
      const listenAction = {
        listen: true,
      };
      response.actions.unshift(sayAction, listenAction);
    }

    // save session attributes.
    const rememberAction = {
      remember: autopilotBot.$session.$data,
    };
    response.actions.unshift(rememberAction);
  }
}
