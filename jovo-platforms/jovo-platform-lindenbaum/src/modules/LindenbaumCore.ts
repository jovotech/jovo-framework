import {
  Plugin,
  JovoError,
  ErrorCode,
  HandleRequest,
  TellOutput,
  AskOutput,
  EnumRequestType,
} from 'jovo-core';

import { Lindenbaum } from '../Lindenbaum';
import { LindenbaumBot } from '../core/LindenbaumBot';
import { LindenbaumRequest } from '../core/LindenbaumRequest';
import { LindenbaumResponse, SayResponse, DropResponse } from '../core/LindenbaumResponse';
import { LindenbaumUser } from '../core/LindenbaumUser';
import { LindenbaumSpeechBuilder } from '../core/LindenbaumSpeechBuilder';

export class LindenbaumCore implements Plugin {
  install(lindenbaum: Lindenbaum) {
    lindenbaum.middleware('$init')!.use(this.init.bind(this));
    lindenbaum.middleware('$request')!.use(this.request.bind(this));
    lindenbaum.middleware('$type')!.use(this.type.bind(this));
    lindenbaum.middleware('$output')!.use(this.output.bind(this));
  }

  uninstall(lindenbaum: Lindenbaum) {}

  async init(handleRequest: HandleRequest) {
    const requestObject: LindenbaumRequest = handleRequest.host.getRequestObject();
    if (requestObject.dialogId && requestObject.timestamp) {
      handleRequest.jovo = new LindenbaumBot(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(lindenbaumBot: LindenbaumBot) {
    if (!lindenbaumBot.$host) {
      throw new JovoError(
        "Couldn't access $host object",
        ErrorCode.ERR_PLUGIN,
        'jovo-platform-lindenbaum',
        'The $host object is necessary to initialize both $request and $user',
      );
    }

    lindenbaumBot.$request = LindenbaumRequest.fromJSON(
      lindenbaumBot.$host.getRequestObject(),
    ) as LindenbaumRequest;
    lindenbaumBot.$user = new LindenbaumUser(lindenbaumBot);
  }

  async type(lindenbaumBot: LindenbaumBot) {
    const request = lindenbaumBot.$request as LindenbaumRequest;
    /**
     * Instead of working with the request paths to determine what kind of request it is,
     * e.g. /session -> LAUNCH,
     * we can use the different request schemes of each path to determine the request type,
     * e.g. only LAUNCH has `remote` property
     *
     * Differences between ExpressJs & cloud providers make this solution easier
     */
    if (request.remote) {
      lindenbaumBot.$type = {
        type: EnumRequestType.LAUNCH,
      };
    } else if (request.text) {
      if (request.type === 'DTMF') {
        lindenbaumBot.$type = {
          type: EnumRequestType.ON_DTMF,
        };
      } else if (request.type === 'SPEECH') {
        lindenbaumBot.$type = {
          type: EnumRequestType.INTENT,
        };
      }
    } else if (request.duration) {
      lindenbaumBot.$type = {
        type: EnumRequestType.ON_INACTIVITY,
      };
    } else {
      lindenbaumBot.$type = {
        type: EnumRequestType.END,
      };
    }
  }

  async output(lindenbaumBot: LindenbaumBot) {
    const output = lindenbaumBot.$output;
    const response = lindenbaumBot.$response as LindenbaumResponse;

    // the responses array was defined using `setResponses()`. That array is final.
    if (response.responses.length > 0) {
      return;
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const dialogId = lindenbaumBot.$request!.getUserId(); // used in every response
    const language = lindenbaumBot.$request!.getLocale();
    /**
     * tell and ask have to be at the beginning of the `response.responses` array
     * because API calls will be made in the same order as the array
     */
    const tell = output.tell;
    if (tell) {
      // DropResponse HAS to be after SayResponse
      const tellResponse: [SayResponse, DropResponse] = this.getTellResponse(
        tell,
        dialogId,
        language,
      );
      response.responses.unshift(...tellResponse);
    }

    const ask = output.ask;
    if (ask) {
      const askResponse: SayResponse = this.getAskResponse(ask, dialogId, language);
      response.responses.unshift(askResponse);
    }

    // the objects inside the Lindenbaum array are already in the correct format
    response.responses.push(...output.Lindenbaum);

    // /call/data has to be first else throws error
    const dataIndex = response.responses.findIndex((value) => value['/call/data']);
    if (dataIndex > -1) {
      const dataObject = response.responses.splice(dataIndex, 1)[0];
      response.responses.unshift(dataObject);
    }
  }

  /**
   * creates and returns the final response structure for `tell` property from the `$output` object.
   * @param {TellOutput} tell
   * @param {string} dialogId
   */
  private getTellResponse(
    tell: TellOutput,
    dialogId: string,
    language: string,
  ): [SayResponse, DropResponse] {
    const sayResponse: SayResponse = {
      '/call/say': {
        dialogId,
        language,
        text: LindenbaumSpeechBuilder.toSSML(tell.speech as string),
        bargeIn: false, // TODO: mention in docs that bargeIn is false by default
      },
    };
    // `drop` specifies that the session should end after the speech output.
    const dropResponse: DropResponse = {
      '/call/drop': {
        dialogId,
      },
    };
    return [sayResponse, dropResponse];
  }

  /**
   * parses the `ask` property from the `$output` object to the final response.
   * @param {AskOutput} ask
   * @param {string} dialogId
   */
  private getAskResponse(ask: AskOutput, dialogId: string, language: string): SayResponse {
    const sayResponse: SayResponse = {
      '/call/say': {
        dialogId,
        language,
        text: LindenbaumSpeechBuilder.toSSML(ask.speech as string),
        bargeIn: false, // TODO: mention in docs that bargeIn is false by default
      },
    };
    return sayResponse;
  }
}
