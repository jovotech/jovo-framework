import {
  MessageValue,
  OutputTemplate,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
  toSSML,
} from '@jovotech/output';
import _merge from 'lodash.merge';
import {
  AlexaResponse,
  AplRenderDocumentDirective,
  OutputSpeech,
  OutputSpeechType,
} from './models';

export interface AlexaOutputTemplateConverterStrategyConfig {
  genericOutputToApl: boolean;
}

export class AlexaOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<AlexaResponse> {
  platformName = 'Alexa';
  responseClass = AlexaResponse;

  constructor(
    public config: Partial<AlexaOutputTemplateConverterStrategyConfig> = {
      genericOutputToApl: true,
    },
  ) {
    super();
  }

  buildResponse(output: OutputTemplate): AlexaResponse {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response: AlexaResponse = {
      version: '1.0',
      response: {},
    };

    const listen = output.platforms?.Alexa?.listen ?? output.listen;
    if (typeof listen !== 'undefined') {
      response.response.shouldEndSession = !listen;
    }

    const message = output.platforms?.Alexa?.message || output.message;
    if (message) {
      response.response.outputSpeech = this.convertMessageToOutputSpeech(message);
    }

    const reprompt = output.platforms?.Alexa?.reprompt || output.reprompt;
    if (reprompt) {
      response.response.reprompt = {
        outputSpeech: this.convertMessageToOutputSpeech(reprompt),
      };
    }

    const card = output.platforms?.Alexa?.card || output.card;
    if (card) {
      if (this.config.genericOutputToApl) {
        if (!response.response.directives) {
          response.response.directives = [];
        }

        response.response.directives.push(card.toApl?.() as AplRenderDocumentDirective);
      } else {
        response.response.card = card.toAlexaCard?.();
      }
    }

    const carousel = output.platforms?.Alexa?.carousel || output.carousel;
    if (carousel && this.config.genericOutputToApl) {
      if (!response.response.directives) {
        response.response.directives = [];
      }

      response.response.directives.push(carousel.toApl?.() as AplRenderDocumentDirective);
    }

    const list = output.platforms?.Alexa?.list;
    if (list && this.config.genericOutputToApl) {
      if (!response.response.directives) {
        response.response.directives = [];
      }

      response.response.directives.push(list.toApl?.() as AplRenderDocumentDirective);
    }

    const quickReplies: QuickReplyValue[] | undefined =
      output.platforms?.Alexa?.quickReplies || output.quickReplies;
    if (quickReplies) {
      const directive: AplRenderDocumentDirective | undefined = response.response
        .directives?.[0] as AplRenderDocumentDirective | undefined;
      if (directive) {
        if (!directive.datasources?.data) {
          directive.datasources = {
            data: {},
          };
        }
        directive.datasources.data.quickReplies = quickReplies.map(
          (quickReply: QuickReplyValue) => {
            if (typeof quickReply === 'string') {
              return { type: 'QuickReply', intent: quickReply };
            } else {
              return { type: 'QuickReply', ...quickReply };
            }
          },
        );
      }
    }

    if (output.platforms?.Alexa?.nativeResponse) {
      _merge(response, output.platforms.Alexa.nativeResponse);
    }

    return response;
  }

  fromResponse(response: AlexaResponse): OutputTemplate {
    const output: OutputTemplate = {};

    if (
      (response.response.outputSpeech?.text || response.response.outputSpeech?.ssml) &&
      response.response.outputSpeech?.toMessage
    ) {
      output.message = response.response.outputSpeech.toMessage();
    }

    if (
      (response.response.reprompt?.outputSpeech?.text ||
        response.response.reprompt?.outputSpeech?.ssml) &&
      response.response.reprompt?.outputSpeech?.toMessage
    ) {
      output.reprompt = response.response.reprompt.outputSpeech.toMessage();
    }

    if (typeof response.response.shouldEndSession === 'boolean') {
      output.listen = !response.response.shouldEndSession;
    }

    if (response.response.card?.toCard) {
      output.card = response.response.card.toCard();
    }

    return output;
  }

  convertMessageToOutputSpeech(message: MessageValue): OutputSpeech {
    return typeof message === 'string'
      ? {
          type: OutputSpeechType.Ssml,
          ssml: toSSML(message),
        }
      : message.toAlexaOutputSpeech?.() || {
          type: OutputSpeechType.Ssml,
          ssml: toSSML(message.text),
        };
  }
}
