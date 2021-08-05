import { PartialDeep } from 'type-fest';
import { DynamicEntities, MessageValue, OutputTemplate, plainToClass } from '.';
import _defaultsDeep from 'lodash.defaultsdeep';

export interface SanitizationConfig {
  maxSize: boolean;
  maxLength: boolean;
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
  responseClass: new () => RESPONSE;

  constructor(config?: PartialDeep<CONFIG>) {
    this.config = _defaultsDeep(this.getDefaultConfig(), config || {});
  }

  prepareOutput(output: OutputTemplate | OutputTemplate[]): OutputTemplate | OutputTemplate[] {
    return plainToClass(OutputTemplate, output);
  }

  abstract toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[];

  prepareResponse(response: RESPONSE | RESPONSE[]): RESPONSE | RESPONSE[] {
    return plainToClass(this.responseClass, response);
  }

  abstract fromResponse(response: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[];

  getDefaultConfig(): CONFIG {
    return {
      omitWarnings: false,
      sanitization: true,
      validation: true,
    } as CONFIG;
  }

  protected shouldSanitize(rule: keyof SanitizationConfig): boolean {
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
    if (!this.shouldSanitize('maxLength') || messageLength <= actualMaxLength) {
      return message;
    }
    if (typeof message === 'object') {
      message.text = message.text.slice(0, actualMaxLength);
    } else {
      message = message.slice(0, actualMaxLength);
    }
    this.logStringTruncationWarning(path, maxLength);
    return message;
  }

  protected sanitizeDynamicEntities(
    dynamicEntities: DynamicEntities,
    path: string,
    maxSize: number,
    offset = 0,
  ): DynamicEntities {
    const actualMaxSize = maxSize - offset;
    if (
      !this.shouldSanitize('maxSize') ||
      !dynamicEntities?.types?.length ||
      dynamicEntities.types.length <= actualMaxSize
    ) {
      return dynamicEntities;
    }
    dynamicEntities.types = dynamicEntities.types.slice(0, actualMaxSize);
    this.logArrayTruncationWarning(path, maxSize);
    return dynamicEntities;
  }

  protected logSanitizationWarning(message: string): void {
    // TODO check format: prefix, no prefix?
    console.warn(message);
  }

  protected logStringTruncationWarning(path: string, maxLength: number): void {
    return this.logTruncationWarning(path, maxLength, false);
  }

  protected logArrayTruncationWarning(path: string, maxSize: number): void {
    return this.logTruncationWarning(path, maxSize, true);
  }

  private logTruncationWarning(path: string, maxLengthOrSize: number, isArray: boolean): void {
    return this.logSanitizationWarning(
      `${path} was truncated due to exceeding the limit of ${maxLengthOrSize} ${
        isArray ? 'items' : 'characters'
      }.`,
    );
  }
}
