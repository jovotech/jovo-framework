import { EnumRequestType, ErrorCode, HandleRequest, JovoError, Plugin } from 'jovo-core';

import { BusinessMessages } from '../BusinessMessages';
import { BusinessMessagesBot } from '../core/BusinessMessagesBot';
import { BusinessMessagesRequest } from '../core/BusinessMessagesRequest';
import { BusinessMessagesResponse } from '../core/BusinessMessagesResponse';
import { BusinessMessagesUser } from '../core/BusinessMessagesUser';
import { TextResponse } from '../Interfaces';
import { Util } from '../Util';

export class BusinessMessagesCore implements Plugin {
  install(businessMessages: BusinessMessages) {
    businessMessages.middleware('$init')!.use(this.init.bind(this));
    businessMessages.middleware('$request')!.use(this.request.bind(this));
    businessMessages.middleware('$type')!.use(this.type.bind(this));
    businessMessages.middleware('$output')!.use(this.output.bind(this));
  }

  async init(handleRequest: HandleRequest) {
    const requestObject: BusinessMessagesRequest = handleRequest.host.getRequestObject();
    if (
      requestObject.agent &&
      requestObject.conversationId &&
      requestObject.customAgentId &&
      requestObject.requestId
    ) {
      handleRequest.jovo = new BusinessMessagesBot(
        handleRequest.app,
        handleRequest.host,
        handleRequest,
      );
    }
  }

  async request(businessMessagesBot: BusinessMessagesBot) {
    if (!businessMessagesBot.$host) {
      throw new JovoError(
        "Couldn't access $host object",
        ErrorCode.ERR_PLUGIN,
        'jovo-platform-google-business-messages',
        'The $host object is necessary to initialize both $request and $user',
      );
    }

    businessMessagesBot.$request = BusinessMessagesRequest.fromJSON(
      businessMessagesBot.$host.getRequestObject(),
    ) as BusinessMessagesRequest;
    businessMessagesBot.$user = new BusinessMessagesUser(businessMessagesBot);
  }

  async type(businessMessagesBot: BusinessMessagesBot) {
    // Google Business Messages doesn't support other request types
    businessMessagesBot.$type = {
      type: EnumRequestType.INTENT,
    };
  }

  async output(businessMessagesBot: BusinessMessagesBot) {
    const output = businessMessagesBot.$output;

    if (!businessMessagesBot.$response) {
      businessMessagesBot.$response = new BusinessMessagesResponse();
    }
    const response = businessMessagesBot.$response as BusinessMessagesResponse;
    const request = businessMessagesBot.$request as BusinessMessagesRequest;
    const messageId = Util.generateRandomString(12);

    // might have been initialized by Cards.ts already
    if (!response.response) {
      response.response = {
        messageId,
        name: `conversations/${request.getSessionId()}/messages/${messageId}`,
        representative: {
          representativeType: 'BOT',
        },
      };
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

    const suggestions = output.BusinessMessages.Suggestions;
    if (suggestions) {
      response.response.suggestions = suggestions;
    }
  }
}
