import {
  DynamicEntities,
  DynamicEntitiesMode,
  DynamicEntity,
  mergeInstances,
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
  toSSML,
} from '@jovotech/output';
import { ALEXA_STRING_MAX_LENGTH, SLOT_TYPE_VALUES_MAX_SIZE, SSML_OFFSET } from './constants';
import {
  AlexaResponse,
  AplRenderDocumentDirective,
  DialogUpdateDynamicEntitiesDirective,
  Directive,
  DynamicEntitiesUpdateBehavior,
  OutputSpeech,
  OutputSpeechType,
  SlotType,
} from './models';

export interface AlexaOutputTemplateConverterStrategyConfig
  extends OutputTemplateConverterStrategyConfig {
  genericOutputToApl: boolean;
}

export class AlexaOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  AlexaResponse,
  AlexaOutputTemplateConverterStrategyConfig
> {
  platformName = 'Alexa';
  responseClass = AlexaResponse;

  getDefaultConfig(): AlexaOutputTemplateConverterStrategyConfig {
    return { ...super.getDefaultConfig(), genericOutputToApl: true };
  }

  prepareOutput(output: OutputTemplate | OutputTemplate[]): OutputTemplate {
    const singleOutput = super.prepareOutput(output);

    if (singleOutput.platforms?.Alexa?.message) {
      singleOutput.platforms.Alexa.message = this.sanitizeMessage(
        singleOutput.platforms.Alexa.message,
        'platforms.Alexa.message',
      );
    } else if (singleOutput.message) {
      singleOutput.message = this.sanitizeMessage(singleOutput.message, 'message');
    }

    if (singleOutput.platforms?.Alexa?.reprompt) {
      singleOutput.platforms.Alexa.reprompt = this.sanitizeMessage(
        singleOutput.platforms.Alexa.reprompt,
        'platforms.Alexa.reprompt',
      );
    } else if (singleOutput.reprompt) {
      singleOutput.reprompt = this.sanitizeMessage(singleOutput.reprompt, 'reprompt');
    }

    if (
      singleOutput.platforms?.Alexa?.listen &&
      typeof singleOutput.platforms.Alexa.listen === 'object' &&
      singleOutput.platforms.Alexa.listen.entities?.types?.length
    ) {
      singleOutput.platforms.Alexa.listen.entities = this.sanitizeDynamicEntities(
        singleOutput.platforms.Alexa.listen.entities,
        'platforms.Alexa.listen.entities.types',
      );
    } else if (
      singleOutput.listen &&
      typeof singleOutput.listen === 'object' &&
      singleOutput.listen.entities?.types?.length
    ) {
      singleOutput.listen.entities = this.sanitizeDynamicEntities(
        singleOutput.listen.entities,
        'listen.entities.types',
      );
    }

    return singleOutput;
  }

  protected sanitizeMessage(
    message: MessageValue,
    path: string,
    maxLength = ALEXA_STRING_MAX_LENGTH,
    offset = SSML_OFFSET,
  ): MessageValue {
    return super.sanitizeMessage(message, path, maxLength, offset);
  }

  protected sanitizeDynamicEntities(
    dynamicEntities: DynamicEntities,
    path: string,
    maxSize = SLOT_TYPE_VALUES_MAX_SIZE,
    offset?: number,
  ): DynamicEntities {
    return super.sanitizeDynamicEntities(dynamicEntities, path, maxSize, offset);
  }

  toResponse(output: OutputTemplate): AlexaResponse {
    const response: AlexaResponse = {
      version: '1.0',
      response: {},
    };

    const addToDirectives = <DIRECTIVES extends Directive[]>(...directives: DIRECTIVES) => {
      if (!response.response.directives) {
        response.response.directives = [];
      }
      response.response.directives.push(...directives);
    };

    const listen = output.platforms?.Alexa?.listen ?? output.listen;
    if (typeof listen !== 'undefined') {
      response.response.shouldEndSession = !listen;

      if (typeof listen === 'object' && listen.entities) {
        const directive = new DialogUpdateDynamicEntitiesDirective();
        if (listen.entities.mode !== DynamicEntitiesMode.Clear) {
          directive.updateBehavior = DynamicEntitiesUpdateBehavior.Replace;
          directive.types = (listen.entities.types || []).map(this.convertDynamicEntityToSlotType);
        } else {
          directive.updateBehavior = DynamicEntitiesUpdateBehavior.Clear;
        }
        addToDirectives(directive);
      }
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
        addToDirectives(card.toApl?.() as AplRenderDocumentDirective);
      } else {
        response.response.card = card.toAlexaCard?.();
      }
    }

    const carousel = output.platforms?.Alexa?.carousel || output.carousel;
    if (carousel && this.config.genericOutputToApl) {
      addToDirectives(carousel.toApl?.() as AplRenderDocumentDirective);
    }

    const list = output.platforms?.Alexa?.list;
    if (list && this.config.genericOutputToApl) {
      addToDirectives(list.toApl?.() as AplRenderDocumentDirective);
    }

    const quickReplies: QuickReplyValue[] | undefined =
      output.platforms?.Alexa?.quickReplies || output.quickReplies;
    if (quickReplies && this.config.genericOutputToApl) {
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
      mergeInstances(response, output.platforms.Alexa.nativeResponse);
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

    // use reversed directives to actually get the last match instead of the first
    const reversedDirectives = (response.response.directives || []).reverse();
    const lastDialogUpdateDirective = reversedDirectives.find(
      (directive) => directive.type === 'Dialog.UpdateDynamicEntities',
    ) as DialogUpdateDynamicEntitiesDirective | undefined;
    if (lastDialogUpdateDirective) {
      output.listen = {
        entities: {
          mode: lastDialogUpdateDirective.updateBehavior,
          types: lastDialogUpdateDirective.types.map(this.convertSlotTypeToDynamicEntity),
        },
      };
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

  private convertDynamicEntityToSlotType(entity: DynamicEntity): SlotType {
    return {
      name: entity.name,
      values: (entity.values || []).slice(0, SLOT_TYPE_VALUES_MAX_SIZE).map((value) => ({
        id: value.id,
        name: {
          value: value.value,
          synonyms: value.synonyms?.slice(),
        },
      })),
    };
  }

  private convertSlotTypeToDynamicEntity(slotType: SlotType): DynamicEntity {
    return {
      name: slotType.name,
      values: slotType.values.map((value) => ({
        id: value.id || value.name.value,
        value: value.name.value,
        synonyms: value.name.synonyms?.slice(),
      })),
    };
  }
}
