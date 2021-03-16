import {
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  toSSML,
} from '@jovotech/output';
import _merge from 'lodash.merge';
import { AlexaResponse, OutputSpeech, OutputSpeechType } from './models';

export class AlexaOutputTemplateConverterStrategy
  implements OutputTemplateConverterStrategy<AlexaResponse> {
  responseClass = AlexaResponse;

  toResponse(output: OutputTemplate): AlexaResponse {
    const response: AlexaResponse = {
      version: '1.0',
      response: {},
    };

    // TODO: fully determine when to set listen
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
      response.response.card = card.toAlexaCard?.();
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
