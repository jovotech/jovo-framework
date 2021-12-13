import {
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
import { DialogflowResponse } from '../DialogflowResponse';
import { QUICK_REPLIES_MAX_SIZE, QUICK_REPLY_MAX_LENGTH, TEXT_MAX_LENGTH } from './constants';
import { EntityOverrideMode, EntityOverrideModeLike, SessionEntityType } from './models';
import { convertMessageToDialogflowText } from './utilities';

export class DialogflowOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  DialogflowResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'dialogflow' as const;
  responseClass = DialogflowResponse;

  protected sanitizeOutput(output: NormalizedOutputTemplate): NormalizedOutputTemplate {
    if (output.message) {
      output.message = this.sanitizeMessage(output.message, 'message');
    }

    if (output.quickReplies) {
      output.quickReplies = this.sanitizeQuickReplies(output.quickReplies, 'quickReplies');
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
    maxSize = QUICK_REPLIES_MAX_SIZE,
    maxLength = QUICK_REPLY_MAX_LENGTH,
  ): QuickReplyValue[] {
    return super.sanitizeQuickReplies(quickReplies, path, maxSize, maxLength);
  }

  toResponse(output: NormalizedOutputTemplate): DialogflowResponse {
    const response: DialogflowResponse = this.normalizeResponse({});

    const listen = output.listen;
    if (typeof listen === 'object' && listen.entities?.types) {
      const entityOverrideMode: EntityOverrideMode =
        listen.entities.mode === DynamicEntitiesMode.Merge
          ? EntityOverrideMode.Supplement
          : EntityOverrideMode.Override;
      response.session_entity_types = Object.keys(listen.entities.types).map((entityName) =>
        this.convertDynamicEntityToSessionEntityType(
          entityName,
          ((listen.entities as DynamicEntities).types as DynamicEntityMap)[entityName],
          entityOverrideMode,
        ),
      );
    }

    const message = output.message;
    if (message) {
      if (!response.fulfillment_messages) {
        response.fulfillment_messages = [];
      }
      response.fulfillment_messages.push({
        message: {
          text: convertMessageToDialogflowText(message),
        },
      });
    }

    const quickReplies = output.quickReplies;
    if (quickReplies?.length) {
      if (!response.fulfillment_messages) {
        response.fulfillment_messages = [];
      }
      response.fulfillment_messages.push({
        message: {
          quick_replies: {
            quick_replies: quickReplies
              .slice(0, QUICK_REPLIES_MAX_SIZE)
              .map(this.convertQuickReplyToDialogflowQuickReply),
          },
        },
      });
    }

    const card = output.card;
    if (card) {
      if (!response.fulfillment_messages) {
        response.fulfillment_messages = [];
      }
      response.fulfillment_messages.push({
        message: {
          card: card.toDialogflowCard!(),
        },
      });
    }

    if (output.platforms?.dialogflow?.nativeResponse) {
      mergeInstances(response, output.platforms.dialogflow.nativeResponse);
    }

    return response;
  }

  fromResponse(response: DialogflowResponse): NormalizedOutputTemplate {
    const output: NormalizedOutputTemplate = {};

    const messageWithText = response.fulfillment_messages?.find((message) => message.message.text);
    if (messageWithText) {
      output.message = messageWithText.message.text?.toMessage?.();
    }

    const messageWithQuickReplies = response.fulfillment_messages?.find(
      (message) => message.message.quick_replies,
    );
    if (messageWithQuickReplies?.message?.quick_replies?.quick_replies?.length) {
      output.quickReplies = messageWithQuickReplies.message.quick_replies.quick_replies;
    }

    const messageWithCard = response.fulfillment_messages?.find((message) => message.message.card);
    if (messageWithCard) {
      output.card = messageWithCard.message.card?.toCard?.();
    }

    if (response.session_entity_types?.length) {
      const mode =
        response.session_entity_types[0].entity_override_mode === EntityOverrideMode.Supplement
          ? DynamicEntitiesMode.Merge
          : DynamicEntitiesMode.Replace;
      output.listen = {
        entities: {
          mode,
          types: response.session_entity_types.reduce(
            (map: DynamicEntityMap, sessionEntityType) => {
              map[sessionEntityType.name] =
                this.convertSessionEntityTypeToDynamicEntity(sessionEntityType);
              return map;
            },
            {},
          ),
        },
      };
    }

    return output;
  }

  convertQuickReplyToDialogflowQuickReply(quickReply: QuickReplyValue): string {
    return typeof quickReply === 'string'
      ? quickReply
      : quickReply.toDialogflowQuickReply?.() || quickReply.value || quickReply.text;
  }

  private convertDynamicEntityToSessionEntityType(
    entityName: string,
    entity: DynamicEntity,
    entityOverrideMode: EntityOverrideModeLike,
  ): SessionEntityType {
    // name usually is a whole path that even includes the session-id, we will have to figure something out for that, but it should not be too complicated.
    return {
      name: entityName,
      entity_override_mode: entityOverrideMode,
      entities: (entity.values || []).map((entityValue) => ({
        value: entityValue.id || entityValue.value,
        // at least one synonym
        synonyms: [entityValue.value, ...(entityValue.synonyms?.slice() || [])],
      })),
    };
  }

  private convertSessionEntityTypeToDynamicEntity(
    sessionEntityType: SessionEntityType,
  ): DynamicEntity {
    return {
      values: sessionEntityType.entities.map((entity) => ({
        id: entity.value,
        value: entity.value,
        synonyms: entity.synonyms.slice(),
      })),
    };
  }
}
