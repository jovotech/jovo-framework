import { PartialDeep } from 'type-fest';
import { OutputTemplate, plainToClass } from '.';
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

  protected logSanitizationWarning(message: string, prefix = 'OutputSanitization'): void {
    console.warn(`[${prefix}]`, message);
  }

  protected logStringTruncationWarning(path: string, maxLength: number, prefix?: string): void {
    return this.logTruncationWarning(path, maxLength, false, prefix);
  }

  protected logArrayTruncationWarning(path: string, maxSize: number, prefix?: string): void {
    return this.logTruncationWarning(path, maxSize, true, prefix);
  }

  private logTruncationWarning(
    path: string,
    maxLengthOrSize: number,
    isArray: boolean,
    prefix?: string,
  ): void {
    return this.logSanitizationWarning(
      `${path} was truncated due to exceeding the limit of ${maxLengthOrSize} ${
        isArray ? 'items' : 'characters'
      }.`,
      prefix,
    );
  }
}
