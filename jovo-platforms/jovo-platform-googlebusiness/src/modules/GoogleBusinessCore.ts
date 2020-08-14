import { EnumRequestType, ErrorCode, HandleRequest, JovoError, Plugin, Util } from 'jovo-core';

import { GoogleBusinessBot } from '../core/GoogleBusinessBot';
import { GoogleBusinessRequest } from '../core/GoogleBusinessRequest';
import { GoogleBusinessResponse } from '../core/GoogleBusinessResponse';
import { GoogleBusinessUser } from '../core/GoogleBusinessUser';
import { GoogleBusiness } from '../GoogleBusiness';
import { TextResponse } from '../Interfaces';

export class GoogleBusinessCore implements Plugin {
  install(googleBusiness: GoogleBusiness) {
    googleBusiness.middleware('$init')!.use(this.init.bind(this));
    googleBusiness.middleware('$request')!.use(this.request.bind(this));
    googleBusiness.middleware('$type')!.use(this.type.bind(this));
    googleBusiness.middleware('$output')!.use(this.output.bind(this));
  }

  async init(handleRequest: HandleRequest) {
    const requestObject: GoogleBusinessRequest = handleRequest.host.getRequestObject();
    if (
      requestObject.agent &&
      requestObject.conversationId &&
      requestObject.customAgentId &&
      requestObject.requestId
    ) {
      handleRequest.jovo = new GoogleBusinessBot(
        handleRequest.app,
        handleRequest.host,
        handleRequest,
      );
    }
  }

  async request(googleBusinessBot: GoogleBusinessBot) {
    if (!googleBusinessBot.$host) {
      throw new JovoError(
        "Couldn't access $host object",
        ErrorCode.ERR_PLUGIN,
        'jovo-platform-googlebusiness',
        'The $host object is necessary to initialize both $request and $user',
      );
    }

    googleBusinessBot.$request = GoogleBusinessRequest.fromJSON(
      googleBusinessBot.$host.getRequestObject(),
    ) as GoogleBusinessRequest;
    googleBusinessBot.$user = new GoogleBusinessUser(googleBusinessBot);
  }

  async type(googleBusinessBot: GoogleBusinessBot) {
    // Google Business Messages doesn't support other request types
    googleBusinessBot.$type = {
      type: EnumRequestType.INTENT,
    };
  }

  async output(googleBusinessBot: GoogleBusinessBot) {
    const output = googleBusinessBot.$output;

    if (!googleBusinessBot.$response) {
      googleBusinessBot.$response = new GoogleBusinessResponse();
    }
    const response = googleBusinessBot.$response as GoogleBusinessResponse;

    if (!response.response) {
      response.response = googleBusinessBot.makeBaseResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = output.tell;
    if (tell) {
      (response.response as TextResponse).text = tell.speech as string;
    }

    const ask = output.ask;
    if (ask) {
      (response.response as TextResponse).text = ask.speech as string;
    }

    const suggestions = output.GoogleBusiness.Suggestions;
    if (suggestions) {
      response.response.suggestions = suggestions;
    }

    const fallback = output.GoogleBusiness.Fallback;
    if (fallback) {
      response.response.fallback = fallback;
    }
  }
}
