import { Constructor, SsmlUtilities } from '@jovotech/common';
import { PartialDeep } from 'type-fest';
import {
  Carousel,
  DynamicEntities,
  DynamicEntityMap,
  MessageValue,
  NormalizedOutputTemplate,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplatePlatforms,
  PlainObjectType,
  plainToClass,
  QuickReplyValue,
} from '.';
import { OutputHelpers } from './OutputHelpers';
import _merge from 'lodash.merge';

export interface MessageMaxLengthObject {
  speech?: number;
  text?: number;
}

export type MessageMaxLength = number | MessageMaxLengthObject;

export interface SanitizationConfig {
  trimArrays: boolean;
  trimStrings: boolean;
  trimMaps: boolean;
}

export interface ValidationConfig {
  before: boolean;
  after: boolean;
}

export interface OutputTemplateConverterStrategyConfig {
  [key: string]: unknown;

  omitWarnings: boolean;
  sanitization: SanitizationConfig | boolean;
  validation: ValidationConfig | boolean;
}

export abstract class OutputTemplateConverterStrategy<
  RESPONSE extends Record<string, unknown>,
  CONFIG extends OutputTemplateConverterStrategyConfig,
> {
  readonly config: CONFIG;
  abstract readonly platformName: keyof OutputTemplatePlatforms;
  abstract readonly responseClass: Constructor<RESPONSE>;

  constructor(config?: PartialDeep<CONFIG>) {
    this.config = _merge(this.getDefaultConfig(), config || {});
  }

  getDefaultConfig(): CONFIG {
    return {
      omitWarnings: false,
      sanitization: true,
      validation: true,
    } as CONFIG;
  }

  // Normalize the output:
  // 1. get the platform specific output
  // 2. get the randomized output
  // 3. return instance(s) of NormalizedOutputTemplate
  normalizeOutput(
    output: OutputTemplate | OutputTemplate[],
  ): NormalizedOutputTemplate | NormalizedOutputTemplate[] {
    const normalize = (outputTemplate: OutputTemplate) =>
      this.getRandomizedOutput(this.getPlatformSpecificOutput(outputTemplate));
    const normalizedOutput = Array.isArray(output) ? output.map(normalize) : normalize(output);
    return plainToClass(NormalizedOutputTemplate, normalizedOutput);
  }

  // Normalize the response:
  // - return instance of responseClass
  normalizeResponse(
    response: PlainObjectType<RESPONSE> | PlainObjectType<RESPONSE>[],
  ): RESPONSE | RESPONSE[] {
    return plainToClass(this.responseClass, response);
  }

  // Convert incoming output template(s) to response(s)
  // Should only be called with normalized output template(s)
  abstract toResponse(
    output: NormalizedOutputTemplate | NormalizedOutputTemplate[],
  ): RESPONSE | RESPONSE[];

  // Convert incoming response(s) to output template(s)
  // Should only be called with normalized response(s)
  abstract fromResponse(
    response: RESPONSE | RESPONSE[],
  ): NormalizedOutputTemplate | NormalizedOutputTemplate[];

  protected getRandomizedOutput(output: OutputTemplate): NormalizedOutputTemplate {
    if (Array.isArray(output.message)) {
      output.message = OutputHelpers.randomize(output.message);
    }
    if (Array.isArray(output.reprompt)) {
      output.reprompt = OutputHelpers.randomize(output.reprompt);
    }
    return output as NormalizedOutputTemplate;
  }

  protected getPlatformSpecificOutput(output: OutputTemplate): OutputTemplate {
    return NormalizedOutputTemplate.getKeys().reduce((outputCopy, outputKey) => {
      if (outputKey === 'platforms') {
        // remove the platforms-output of all other platforms due to not being used anyways
        if (output.platforms?.[this.platformName]) {
          outputCopy.platforms = {};
          outputCopy.platforms[this.platformName] = output.platforms?.[this.platformName];
        }
        return outputCopy;
      }
      const newValue = this.getOutputValue(output, outputKey);
      if (typeof newValue !== 'undefined') {
        outputCopy[outputKey] = newValue;
      }
      return outputCopy;
    }, {} as OutputTemplate);
  }

  protected getOutputValue<KEY extends keyof OutputTemplateBase>(
    output: OutputTemplate,
    key: KEY,
  ): OutputTemplateBase[KEY] {
    const platformValue = output.platforms?.[this.platformName]?.[key];
    if (platformValue === null) {
      return undefined;
    }
    return platformValue ?? output[key];
  }

  protected shouldSanitize(rule?: keyof SanitizationConfig): boolean {
    if (!rule) {
      return !!this.config.sanitization;
    }
    return typeof this.config.sanitization === 'object'
      ? this.config.sanitization[rule]
      : this.config.sanitization;
  }

  protected sanitizeMessage(
    message: MessageValue,
    path: string,
    maxLength: MessageMaxLength,
    offset = 0,
  ): MessageValue {
    const speechMaxLength =
      (typeof maxLength === 'number' ? maxLength : maxLength.speech || Infinity) - offset;
    const textMaxLength = typeof maxLength === 'number' ? maxLength : maxLength.text || Infinity;

    const speechLength = typeof message === 'string' ? message.length : message.speech?.length || 0;
    const textLength = typeof message === 'string' ? message.length : message.text?.length || 0;

    const isSpeechExceeding = speechLength > speechMaxLength;
    const isTextExceeding = textLength > textMaxLength;
    const isExceeding = isSpeechExceeding || isTextExceeding;

    if (!this.shouldSanitize('trimStrings') || !isExceeding) {
      return message;
    }

    if (typeof message === 'object') {
      if (message.speech && isSpeechExceeding) {
        message.speech = message.speech.slice(0, speechMaxLength);
        this.logStringTrimWarning(`${path}.speech`, speechMaxLength);
      }
      if (message.text && isTextExceeding) {
        message.text = message.text.slice(0, textMaxLength);
        this.logStringTrimWarning(`${path}.text`, textMaxLength);
      }
    } else {
      const maxLength = SsmlUtilities.isSSML(message) ? speechMaxLength : textMaxLength;
      message = message.slice(0, maxLength);
      this.logStringTrimWarning(path, maxLength);
    }

    return message;
  }

  protected sanitizeDynamicEntities(
    dynamicEntities: DynamicEntities,
    path: string,
    maxEntries: number,
  ): DynamicEntities {
    if (
      !this.shouldSanitize('trimMaps') ||
      !dynamicEntities?.types ||
      Object.keys(dynamicEntities.types).length <= maxEntries
    ) {
      return dynamicEntities;
    }
    dynamicEntities.types = Object.keys(dynamicEntities)
      .slice(0, maxEntries)
      .reduce((map: DynamicEntityMap, entityKey) => {
        if (!dynamicEntities.types) {
          return map;
        }
        map[entityKey] = dynamicEntities.types[entityKey];
        return map;
      }, {});
    this.logMapTrimWarning(path, maxEntries);
    return dynamicEntities;
  }

  protected sanitizeQuickReplies(
    quickReplies: QuickReplyValue[],
    path: string,
    maxSize: number,
    maxLength: number,
  ): QuickReplyValue[] {
    if (!this.shouldSanitize('trimArrays') || quickReplies.length <= maxSize) {
      return quickReplies;
    }
    quickReplies = quickReplies.slice(0, maxSize);
    this.logArrayTrimWarning(path, maxSize);
    if (!this.shouldSanitize('trimStrings')) {
      return quickReplies;
    }
    return quickReplies.map((quickReply, index) => {
      const quickReplyTextLength =
        typeof quickReply === 'string' ? quickReply.length : quickReply.text.length;
      if (quickReplyTextLength <= maxLength) {
        return quickReply;
      }
      if (typeof quickReply === 'object') {
        quickReply.text = quickReply.text.slice(0, maxLength);
      } else {
        quickReply = quickReply.slice(0, maxLength);
      }
      this.logStringTrimWarning(`${path}[${index}]`, maxLength);
      return quickReply;
    });
  }

  protected sanitizeCarousel(
    carousel: Carousel,
    path: string,
    minSize: number,
    maxSize: number,
  ): Carousel {
    if (
      !this.shouldSanitize('trimArrays') ||
      (carousel.items.length >= minSize && carousel.items.length <= maxSize)
    ) {
      return carousel;
    }
    carousel.items = carousel.items.slice(0, maxSize);
    this.logArrayTrimWarning(path, maxSize);
    return carousel;
  }

  protected logSanitizationWarning(message: string): void {
    if (this.config.omitWarnings) {
      return;
    }
    // eslint-disable-next-line no-console
    console.warn(message);
  }

  protected logStringTrimWarning(path: string, maxLength: number): void {
    return this.logSanitizationWarning(this.getTrimMessage(path, maxLength, 'characters'));
  }

  protected logArrayTrimWarning(path: string, maxSize: number): void {
    return this.logSanitizationWarning(this.getTrimMessage(path, maxSize, 'items'));
  }

  protected logMapTrimWarning(path: string, maxEntries: number): void {
    return this.logSanitizationWarning(this.getTrimMessage(path, maxEntries, 'entries'));
  }

  private getTrimMessage(path: string, max: number, suffix: string): string {
    const pathStartsWithIndex = /^\[[\d+]].*/.test(path);
    const rootPath = `$output${pathStartsWithIndex ? '' : '.'}`;
    path = rootPath + path;
    return `${path} was trimmed due to exceeding the limit of ${max} ${suffix}.`;
  }
}
