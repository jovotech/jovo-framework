import {
  Carousel,
  DynamicEntities,
  DynamicEntitiesMode,
  DynamicEntity,
  DynamicEntityMap,
  mergeInstances,
  MessageValue,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { GoogleAssistantResponse } from '../GoogleAssistantResponse';
import {
  COLLECTION_MAX_SIZE,
  COLLECTION_MIN_SIZE,
  SUGGESTION_TITLE_MAX_LENGTH,
  SUGGESTIONS_MAX_SIZE,
  TEXT_MAX_LENGTH,
} from './constants';
import {
  Entry,
  Session,
  Suggestion,
  TypeOverride,
  TypeOverrideMode,
  TypeOverrideModeLike,
} from './models';
import {
  convertMessageToGoogleAssistantSimple,
  convertRichAudioToGoogleAssistantSimple,
} from './utilities';

export class GoogleAssistantOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  GoogleAssistantResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'googleAssistant' as const;
  responseClass = GoogleAssistantResponse;

  protected sanitizeOutput(output: NormalizedOutputTemplate): NormalizedOutputTemplate {
    if (output.message) {
      output.message = this.sanitizeMessage(output.message, 'message');
    }

    if (output.reprompt) {
      output.reprompt = this.sanitizeMessage(output.reprompt, 'reprompt');
    }

    if (output.quickReplies) {
      output.quickReplies = this.sanitizeQuickReplies(output.quickReplies, 'quickReplies');
    }

    if (output.carousel) {
      output.carousel = this.sanitizeCarousel(output.carousel, 'carousel');
    }

    return output;
  }

  protected sanitizeMessage(
    message: MessageValue,
    path: string,
    maxLength = TEXT_MAX_LENGTH,
    offset?: number,
  ): MessageValue {
    return super.sanitizeMessage(message, path, maxLength, offset);
  }

  protected sanitizeQuickReplies(
    quickReplies: QuickReplyValue[],
    path: string,
    maxSize = SUGGESTIONS_MAX_SIZE,
    maxLength = SUGGESTION_TITLE_MAX_LENGTH,
  ): QuickReplyValue[] {
    return super.sanitizeQuickReplies(quickReplies, path, maxSize, maxLength);
  }

  protected sanitizeCarousel(
    carousel: Carousel,
    path: string,
    minSize = COLLECTION_MIN_SIZE,
    maxSize = COLLECTION_MAX_SIZE,
  ): Carousel {
    return super.sanitizeCarousel(carousel, path, minSize, maxSize);
  }

  toResponse(output: NormalizedOutputTemplate): GoogleAssistantResponse {
    const response: GoogleAssistantResponse = this.normalizeResponse({});

    function getEmptySession(): Session {
      return { id: '', params: {}, languageCode: '' };
    }

    const listen = output.listen;
    if (listen === false) {
      response.scene = {
        name: '',
        slots: {},
        next: {
          name: 'actions.scene.END_CONVERSATION',
        },
      };
    } else if (typeof listen === 'object' && listen.entities?.types) {
      const typeOverrideMode: TypeOverrideMode =
        listen.entities.mode === DynamicEntitiesMode.Merge
          ? TypeOverrideMode.Merge
          : TypeOverrideMode.Replace;
      if (!response.session) {
        response.session = getEmptySession();
      }
      response.session.typeOverrides = Object.keys(listen.entities.types).map((entityName) =>
        this.convertDynamicEntityToTypeOverride(
          entityName,
          ((listen.entities as DynamicEntities).types as DynamicEntityMap)[entityName],
          typeOverrideMode,
        ),
      );
    }

    const richAudio = output.richAudio;
    if (richAudio) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.firstSimple = convertRichAudioToGoogleAssistantSimple(richAudio);
    }

    const message = output.message;
    if (message && !richAudio) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.firstSimple = convertMessageToGoogleAssistantSimple(message);
    }

    const reprompt = output.reprompt;
    if (reprompt) {
      if (!response.session) {
        response.session = getEmptySession();
      }
      const text = typeof reprompt === 'string' ? reprompt : reprompt.text || reprompt.speech;
      response.session.params._GOOGLE_ASSISTANT_REPROMPTS_ = {
        NO_INPUT_1: text,
        NO_INPUT_2: text,
        NO_INPUT_FINAL: text,
      };
    }

    const quickReplies = output.quickReplies;
    if (quickReplies?.length) {
      if (!response.prompt) {
        response.prompt = {};
      }
      response.prompt.suggestions = quickReplies
        .slice(0, 8)
        .map(this.convertQuickReplyToSuggestion);
    }

    const card = output.card;
    if (card) {
      if (!response.prompt) {
        response.prompt = {};
      }
      if (!response.prompt.content) {
        response.prompt.content = {};
      }
      response.prompt.content.card = card.toGoogleAssistantCard?.();
    }

    const carousel = output.carousel;
    // if a carousel exists and selection.entityType is set for it (otherwise carousel can't be displayed)
    if (carousel?.selection?.entityType && carousel?.selection?.intent) {
      const collectionData = carousel.toGoogleAssistantCollectionData?.();
      if (collectionData) {
        if (!response.session) {
          response.session = getEmptySession();
        }
        if (!response.session.typeOverrides) {
          response.session.typeOverrides = [];
        }
        response.session.typeOverrides.push(collectionData.typeOverride);
        response.session.params._GOOGLE_ASSISTANT_SELECTION_INTENT_ = carousel.selection.intent;

        if (!response.prompt) {
          response.prompt = {};
        }
        if (!response.prompt.content) {
          response.prompt.content = {};
        }
        response.prompt.content.collection = collectionData.collection;
      }
    }

    if (output.platforms?.googleAssistant?.nativeResponse) {
      mergeInstances(response, output.platforms.googleAssistant.nativeResponse);
    }

    return response;
  }

  fromResponse(response: GoogleAssistantResponse): NormalizedOutputTemplate {
    const output: NormalizedOutputTemplate = {};

    const simple = response.prompt?.firstSimple || response.prompt?.lastSimple;
    if (simple?.toMessage) {
      output.message = simple.toMessage();
    }
    const reprompts = response.session?.params?._GOOGLE_ASSISTANT_REPROMPTS_ as
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
        response.session.typeOverrides[0].typeOverrideMode === TypeOverrideMode.Merge
          ? DynamicEntitiesMode.Merge
          : DynamicEntitiesMode.Replace;

      output.listen = {
        entities: {
          mode,
          types: response.session.typeOverrides.reduce(
            (map: DynamicEntityMap, typeOverride: TypeOverride) => {
              map[typeOverride.name] = this.convertTypeOverrideToDynamicEntity(typeOverride);
              return map;
            },
            {},
          ),
        },
      };
    }

    const suggestions = response?.prompt?.suggestions;
    if (suggestions?.length) {
      output.quickReplies = suggestions.map((suggestion: Suggestion) => {
        return suggestion.toQuickReply!();
      });
    }

    const card = response.prompt?.content?.card;
    if (card?.toCard) {
      output.card = card.toCard();
    }

    if (response?.session?.typeOverrides && response?.prompt?.content?.collection) {
      const carouselTypeOverride = response.session?.typeOverrides?.find((item: TypeOverride) => {
        return item.name === 'prompt_option';
      });

      if (carouselTypeOverride?.synonym) {
        output.carousel = {
          items: carouselTypeOverride.synonym.entries.map((entry: Entry) => {
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

  convertQuickReplyToSuggestion(quickReply: QuickReplyValue): Suggestion {
    return typeof quickReply === 'string'
      ? { title: quickReply }
      : quickReply.toGoogleAssistantSuggestion?.() || {
          title: quickReply.text,
        };
  }

  private convertDynamicEntityToTypeOverride(
    entityName: string,
    entity: DynamicEntity,
    mode: TypeOverrideModeLike = TypeOverrideMode.Replace,
  ): TypeOverride {
    return {
      name: entityName,
      typeOverrideMode: mode,
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
      values: (typeOverride.synonym?.entries || []).map((entry) => ({
        id: entry.name,
        value: entry.name,
        synonyms: entry.synonyms?.slice(),
      })),
    };
  }
}
