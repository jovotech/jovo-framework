import { GenericOutput, Message, OutputConverterStrategy, QuickReply } from '@jovotech/output';
import _merge from 'lodash.merge';
import { GoogleAssistantResponse, Simple, Suggestion } from './models';

export class GoogleAssistantOutputConverterStrategy
  implements OutputConverterStrategy<GoogleAssistantResponse> {
  responseClass = GoogleAssistantResponse;

  toResponse(output: GenericOutput): GoogleAssistantResponse {
    const response: GoogleAssistantResponse = {};

    const listen = output.platforms?.GoogleAssistant?.listen ?? output.listen;
    if (listen === false) {
      response.scene = {
        name: '',
        slots: {},
        next: {
          name: 'actions.scene.END_CONVERSATION',
        },
      };
    }

    const message = output.platforms?.GoogleAssistant?.message || output.message;
    if (message) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.firstSimple = this.convertMessageToSimple(message);
    }

    const reprompt = output.platforms?.GoogleAssistant?.reprompt || output.reprompt;
    if (reprompt) {
      if (!response.session) {
        response.session = { id: '', params: {}, languageCode: '' };
      }
      const text = typeof reprompt === 'string' ? reprompt : reprompt.displayText || reprompt.text;
      response.session.params['_JOVO_SESSION_'] = {
        reprompts: {
          NO_INPUT1: text,
          NO_INPUT2: text,
          NO_INPUTFINAL: text,
        },
      };
    }

    const quickReplies = output.platforms?.GoogleAssistant?.quickReplies || output.quickReplies;
    if (quickReplies?.length) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.suggestions = quickReplies.map(this.convertQuickReplyToSuggestion);
    }

    const card = output.platforms?.GoogleAssistant?.card || output.card;
    if (card) {
      if (!response.prompt) {
        response.prompt = {};
      }
      if (!response.prompt.content) {
        response.prompt.content = {};
      }
      response.prompt.content.card = card.toGoogleAssistantCard?.();
    }

    const carousel = output.platforms?.GoogleAssistant?.carousel || output.carousel;
    if (carousel) {
      const collectionData = carousel.toGoogleAssistantCollectionData?.();
      if (collectionData) {
        if (!response.session) {
          response.session = { id: '', params: {}, languageCode: '' };
        }
        response.session.typeOverrides = [collectionData.typeOverride];

        if (!response.prompt) {
          response.prompt = {};
        }
        if (!response.prompt.content) {
          response.prompt.content = {};
        }
        response.prompt.content.collection = collectionData.collection;
      }
    }

    if (output.platforms?.GoogleAssistant?.nativeResponse) {
      _merge(response, output.platforms.GoogleAssistant.nativeResponse);
    }

    return response;
  }

  fromResponse(response: GoogleAssistantResponse): GenericOutput {
    const output: GenericOutput = {};

    const simple = response.prompt?.firstSimple || response.prompt?.lastSimple;
    if (simple?.toMessage) {
      output.message = simple.toMessage();
    }

    const reprompts = (response.session?.params?.['_JOVO_SESSION_'] as
      | Record<string, unknown>
      | undefined)?.reprompts as Record<string, string>;
    const reprompt = reprompts?.NO_INPUT1 || reprompts?.NO_INPUT2 || reprompts?.NO_INPUTFINAL;
    if (reprompt) {
      output.reprompt = reprompt;
    }

    if (response.scene?.next?.name === 'actions.scene.END_CONVERSATION') {
      output.listen = false;
    }

    const suggestions = response?.prompt?.suggestions;
    if (suggestions?.length) {
      output.quickReplies = suggestions.map((suggestion) => {
        return suggestion.toQuickReply!();
      });
    }

    const card = response.prompt?.content?.card;
    if (card?.toGenericCard) {
      output.card = card.toGenericCard();
    }

    if (response?.session?.typeOverrides && response?.prompt?.content?.collection) {
      const carouselTypeOverride = response.session?.typeOverrides?.find((item) => {
        return item.name === 'prompt_option';
      });

      if (carouselTypeOverride?.synonym) {
        output.carousel = {
          items: carouselTypeOverride.synonym.entries.map((entry) => {
            return {
              title: entry.display?.title || '',
              subtitle: entry.display?.description,
              imageUrl: entry.display?.image?.url,
              key: entry.name,
            };
          }),
        };
      }
    }

    return output;
  }

  convertMessageToSimple(message: Message): Simple {
    return typeof message === 'string'
      ? { speech: message }
      : message.toGoogleAssistantSimple?.() || {
          speech: message.text,
          text: message.displayText,
        };
  }

  convertQuickReplyToSuggestion(quickReply: QuickReply): Suggestion {
    return typeof quickReply === 'string'
      ? { title: quickReply }
      : quickReply.toGoogleAssistantSuggestion?.() || {
          title: quickReply.text,
        };
  }
}
