import _defaultsDeep from 'lodash.defaultsdeep';
import { PartialDeep } from 'type-fest';
import {
  Carousel,
  DynamicEntities,
  DynamicEntityMap,
  MessageValue,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplatePlatforms,
  plainToClass,
  QuickReplyValue,
} from '.';

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
  abstract readonly responseClass: new () => RESPONSE;

  constructor(config?: PartialDeep<CONFIG>) {
    this.config = _defaultsDeep(this.getDefaultConfig(), config || {});
  }

  getDefaultConfig(): CONFIG {
    return {
      omitWarnings: false,
      sanitization: true,
      validation: true,
    } as CONFIG;
  }

  /**
   * Prepare the output by applying the platform-specific output that is related to the strategy.
   * Additionally, instances are initialized based on the objects.
   */
  prepareOutput(output: OutputTemplate | OutputTemplate[]): OutputTemplate | OutputTemplate[] {
    output = Array.isArray(output)
      ? output.map((outputItem: OutputTemplate) => this.getPlatformSpecificOutput(outputItem))
      : this.getPlatformSpecificOutput(output);
    return plainToClass(OutputTemplate, output);
  }

  abstract toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[];

  prepareResponse(response: RESPONSE | RESPONSE[]): RESPONSE | RESPONSE[] {
    return plainToClass(this.responseClass, response);
  }

  abstract fromResponse(response: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[];

  protected getPlatformSpecificOutput(output: OutputTemplate): OutputTemplate {
    return OutputTemplate.getKeys().reduce((outputCopy, outputKey) => {
      if (outputKey === 'platforms') {
        // remove the platforms-output of all other platforms due to not being used anyways
        if (output.platforms?.[this.platformName]) {
          outputCopy.platforms = {};
          outputCopy.platforms[this.platformName] = output.platforms?.[this.platformName];
        }
        return outputCopy;
      }
      const newValue = this.getOutputValue(output, outputKey);
      if (newValue) {
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
    maxLength: number,
    offset = 0,
  ): MessageValue {
    const actualMaxLength = maxLength - offset;
    const messageLength = typeof message === 'object' ? message.text.length : message.length;
    if (!this.shouldSanitize('trimStrings') || messageLength <= actualMaxLength) {
      return message;
    }
    if (typeof message === 'object') {
      message.text = message.text.slice(0, actualMaxLength);
    } else {
      message = message.slice(0, actualMaxLength);
    }
    this.logStringTrimWarning(path, maxLength);
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
