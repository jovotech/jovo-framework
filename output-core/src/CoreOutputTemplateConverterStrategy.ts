import {
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  QuickReplyValue,
} from '@jovotech/output';
import _merge from 'lodash.merge';
import {
  ActionType,
  CoreResponse,
  QuickReply,
  QuickReplyAction,
  SpeechAction,
  TextAction,
  VisualAction,
} from './models';

export interface CoreOutputTemplateConverterStrategyConfig {
  defaultOutputAction: ActionType.Text | ActionType.Speech;
}

export class CoreOutputTemplateConverterStrategy
  implements OutputTemplateConverterStrategy<CoreResponse> {
  config: CoreOutputTemplateConverterStrategyConfig = {
    defaultOutputAction: ActionType.Speech,
  };

  constructor(config?: CoreOutputTemplateConverterStrategyConfig) {
    if (config) {
      this.config = config;
    }
  }

  responseClass = CoreResponse;

  toResponse(output: OutputTemplate): CoreResponse {
    const listen = output.platforms?.Core?.listen ?? output.listen;

    const response: CoreResponse = {
      version: '',
      actions: [],
      session: {
        end: listen === false,
        data: {},
      },
      context: {
        request: {},
      },
    };

    const message = output.platforms?.Core?.message || output.message;
    if (message) {
      response.actions.push(this.convertMessageToAction(message));
    }

    const reprompt = output.platforms?.Core?.reprompt || output.reprompt;
    if (reprompt) {
      if (!response.reprompts) {
        response.reprompts = [];
      }
      response.reprompts.push(this.convertMessageToAction(reprompt));
    }

    const card = output.platforms?.Core?.card || output.card;
    if (card?.toCoreVisualAction) {
      response.actions.push(card.toCoreVisualAction());
    }

    const quickReplies = output.platforms?.Core?.quickReplies || output.quickReplies;
    if (quickReplies?.length) {
      response.actions.push({
        type: ActionType.QuickReply,
        replies: quickReplies.map(this.convertQuickReplyToAction),
      });
    }

    if (output.platforms?.Core?.nativeResponse) {
      _merge(response, output.platforms.Core.nativeResponse);
    }

    return response;
  }

  fromResponse(response: CoreResponse): OutputTemplate {
    const output: OutputTemplate = {
      listen: !response.session.end,
    };

    const firstTextOrSpeechAction = response.actions.find(
      (action) => action.type === this.config.defaultOutputAction,
    ) as TextAction | SpeechAction | undefined;
    if (firstTextOrSpeechAction?.toMessage) {
      output.message = firstTextOrSpeechAction.toMessage();
    }

    const firstTextOrSpeechRepromptAction = response.reprompts?.find(
      (action) => action.type === this.config.defaultOutputAction,
    ) as TextAction | SpeechAction | undefined;
    if (firstTextOrSpeechRepromptAction?.toMessage) {
      output.reprompt = firstTextOrSpeechRepromptAction.toMessage();
    }

    const firstQuickReplyAction = response.actions.find(
      (action) => action.type === ActionType.QuickReply,
    ) as QuickReplyAction | undefined;
    if (firstQuickReplyAction) {
      output.quickReplies = firstQuickReplyAction.replies.map((reply) => reply.toQuickReply!());
    }

    const firstVisualAction = response.actions.find(
      (action) => action.type === ActionType.Visual,
    ) as VisualAction | undefined;
    if (firstVisualAction?.toCard) {
      output.card = firstVisualAction.toCard();
    }

    return output;
  }

  convertMessageToAction(message: MessageValue): TextAction | SpeechAction {
    if (typeof message === 'string') {
      return this.config.defaultOutputAction === ActionType.Speech
        ? {
            type: ActionType.Speech,
            ssml: message,
            plain: message,
          }
        : {
            type: ActionType.Text,
            text: message,
          };
    } else {
      return this.config.defaultOutputAction === ActionType.Speech
        ? message.toCoreSpeechAction?.() || {
            type: ActionType.Speech,
            ssml: message.text,
            plain: message.text,
          }
        : message.toCoreTextAction?.() || { type: ActionType.Text, text: message.text };
    }
  }

  convertQuickReplyToAction(quickReply: QuickReplyValue): QuickReply {
    return typeof quickReply === 'string'
      ? { value: quickReply }
      : quickReply.toCoreQuickReply?.() || {
          label: quickReply.text,
          value: quickReply.value || quickReply.text,
        };
  }
}
