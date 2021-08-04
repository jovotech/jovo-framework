import {
  DynamicEntitiesMode,
  DynamicEntity,
  mergeInstances,
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import {
  GoogleAssistantResponse,
  Session,
  Simple,
  Suggestion,
  TypeOverride,
  TypeOverrideMode,
  TypeOverrideModeLike,
} from './models';

export class GoogleAssistantOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  GoogleAssistantResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'GoogleAssistant';
  responseClass = GoogleAssistantResponse;

  buildResponse(output: OutputTemplate): GoogleAssistantResponse {
    const response: GoogleAssistantResponse = {};

    function getEmptySession(): Session {
      return { id: '', params: {}, languageCode: '' };
    }

    const listen = output.platforms?.GoogleAssistant?.listen ?? output.listen;
    if (listen === false) {
      response.scene = {
        name: '',
        slots: {},
        next: {
          name: 'actions.scene.END_CONVERSATION',
        },
      };
    } else if (typeof listen === 'object' && listen.entities?.types?.length) {
      const typeOverrideMode: TypeOverrideMode =
        listen.entities.mode === DynamicEntitiesMode.Merge
          ? TypeOverrideMode.Merge
          : TypeOverrideMode.Replace;
      if (!response.session) {
        response.session = getEmptySession();
      }
      response.session.typeOverrides = listen.entities.types.map((entity) =>
        this.convertDynamicEntityToTypeOverride(entity, typeOverrideMode),
      );
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
        response.session = getEmptySession();
      }
      const text = typeof reprompt === 'string' ? reprompt : reprompt.displayText || reprompt.text;
      response.session.params._GA_REPROMPTS_ = {
        NO_INPUT_1: text,
        NO_INPUT_2: text,
        NO_INPUT_FINAL: text,
      };
    }

    const quickReplies = output.platforms?.GoogleAssistant?.quickReplies || output.quickReplies;
    if (quickReplies?.length) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.suggestions = quickReplies
        .slice(0, 8)
        .map(this.convertQuickReplyToSuggestion);
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
          response.session = getEmptySession();
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
      mergeInstances(response, output.platforms.GoogleAssistant.nativeResponse);
    }

    return response;
  }

  fromResponse(response: GoogleAssistantResponse): OutputTemplate {
    const output: OutputTemplate = {};

    const simple = response.prompt?.firstSimple || response.prompt?.lastSimple;
    if (simple?.toMessage) {
      output.message = simple.toMessage();
    }
    const reprompts = response.session?.params?._GA_REPROMPTS_ as
      | Record<'NO_INPUT_1' | 'NO_INPUT_2' | 'NO_INPUT_FINAL', string>
      | undefined;
    const reprompt = reprompts?.NO_INPUT_1 || reprompts?.NO_INPUT_2 || reprompts?.NO_INPUT_FINAL;
    if (reprompt) {
      output.reprompt = reprompt;
    }

    if (response.scene?.next?.name === 'actions.scene.END_CONVERSATION') {
      output.listen = false;
    }

    if (response.session?.typeOverrides?.length) {
      // only the first should be sufficient
      const mode =
        response.session.typeOverrides[0].mode === TypeOverrideMode.Merge
          ? DynamicEntitiesMode.Merge
          : DynamicEntitiesMode.Replace;

      output.listen = {
        entities: {
          mode,
          types: response.session.typeOverrides.map(this.convertTypeOverrideToDynamicEntity),
        },
      };
    }

    const suggestions = response?.prompt?.suggestions;
    if (suggestions?.length) {
      output.quickReplies = suggestions.map((suggestion) => {
        return suggestion.toQuickReply!();
      });
    }

    const card = response.prompt?.content?.card;
    if (card?.toCard) {
      output.card = card.toCard();
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

  convertMessageToSimple(message: MessageValue): Simple {
    return typeof message === 'string'
      ? { speech: message }
      : message.toGoogleAssistantSimple?.() || {
          speech: message.text,
          text: message.displayText,
        };
  }

  convertQuickReplyToSuggestion(quickReply: QuickReplyValue): Suggestion {
    return typeof quickReply === 'string'
      ? { title: quickReply }
      : quickReply.toGoogleAssistantSuggestion?.() || {
          title: quickReply.text,
        };
  }

  private convertDynamicEntityToTypeOverride(
    entity: DynamicEntity,
    mode: TypeOverrideModeLike = TypeOverrideMode.Replace,
  ): TypeOverride {
    return {
      name: entity.name,
      mode,
      synonym: {
        entries: (entity.values || []).map((entityValue) => ({
          name: entityValue.id || entityValue.value,
          synonyms: entityValue.synonyms?.slice() || [],
        })),
      },
    };
  }

  private convertTypeOverrideToDynamicEntity(typeOverride: TypeOverride): DynamicEntity {
    return {
      name: typeOverride.name,
      values: (typeOverride.synonym?.entries || []).map((entry) => ({
        id: entry.name,
        value: entry.name,
        synonyms: entry.synonyms?.slice(),
      })),
    };
  }
}
