import {
  Message,
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

  toResponse(outputOrOutputs: OutputTemplate | OutputTemplate[]): AlexaResponse {
    const response: AlexaResponse = {
      version: '1.0',
      response: {},
    };

    const mergedOutput = Array.isArray(outputOrOutputs)
      ? this.mergeOutputs(outputOrOutputs)
      : outputOrOutputs;

    // // TODO: fully determine when to set listen
    const listen = mergedOutput.platforms?.Alexa?.listen ?? mergedOutput.listen;
    if (typeof listen !== 'undefined') {
      response.response.shouldEndSession = !listen;
    }

    const message = mergedOutput.platforms?.Alexa?.message || mergedOutput.message;
    if (message) {
      response.response.outputSpeech = this.convertMessageToOutputSpeech(message);
    }

    const reprompt = mergedOutput.platforms?.Alexa?.reprompt || mergedOutput.reprompt;
    if (reprompt) {
      response.response.reprompt = {
        outputSpeech: this.convertMessageToOutputSpeech(reprompt),
      };
    }

    const card = mergedOutput.platforms?.Alexa?.card || mergedOutput.card;
    if (card) {
      response.response.card = card.toAlexaCard?.();
    }

    if (mergedOutput.platforms?.Alexa?.nativeResponse) {
      _merge(response, mergedOutput.platforms.Alexa.nativeResponse);
    }

    return response;
  }

  mergeOutputs(output: OutputTemplate[]): OutputTemplate {
    return output.reduce((accumulator, current) => this.mergeOutputWith(accumulator, current), {});
  }

  mergeOutputWith(target: OutputTemplate, mergeWith: OutputTemplate): OutputTemplate {
    this.mergeOutputMessageIfSet(target, mergeWith, 'message');
    this.mergeOutputMessageIfSet(target, mergeWith, 'reprompt');

    // TODO determine whether only the last set card and listen should be used
    if (mergeWith.card) {
      target.card = { ...mergeWith.card };
    }
    if (typeof mergeWith.listen === 'boolean') {
      target.listen = mergeWith.listen;
    }
    if (mergeWith.platforms?.Alexa) {
      if (!target.platforms) {
        target.platforms = {};
      }
      if (!target.platforms.Alexa) {
        target.platforms.Alexa = {};
      }

      if (mergeWith.platforms.Alexa.nativeResponse) {
        if (!target.platforms.Alexa.nativeResponse) {
          target.platforms.Alexa.nativeResponse = {};
        }
        // TODO determine whether merge is sufficient
        _merge(target.platforms.Alexa.nativeResponse, mergeWith.platforms.Alexa.nativeResponse);
      }

      this.mergeOutputWith(target.platforms.Alexa, mergeWith.platforms.Alexa);
    }
    return target;
  }

  private mergeOutputMessageIfSet(
    target: OutputTemplate,
    mergeWith: OutputTemplate,
    key: 'message' | 'reprompt',
  ): void {
    if (mergeWith[key]) {
      const mergeText =
        typeof mergeWith[key] === 'string' ? mergeWith[key] : (mergeWith[key] as Message).text;

      // TODO Determine whether the space should be added here
      target[key] = target[key] ? [target.message, mergeText].join(' ') : mergeText;
    }
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
