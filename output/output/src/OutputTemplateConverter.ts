import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
  JovoResponse,
  NormalizedOutputTemplate,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
  PlainObjectType,
  ValidationConfig,
} from '.';
import { OutputValidationError } from './errors/OutputValidationError';

export class OutputTemplateConverter<
  STRATEGY extends OutputTemplateConverterStrategy<RESPONSE, CONFIG>,
  RESPONSE extends JovoResponse = InstanceType<STRATEGY['responseClass']>,
  CONFIG extends OutputTemplateConverterStrategyConfig = STRATEGY['config'],
> {
  constructor(readonly strategy: STRATEGY) {}

  async validateOutput(
    output:
      | OutputTemplate
      | OutputTemplate[]
      | NormalizedOutputTemplate
      | NormalizedOutputTemplate[],
  ): Promise<ValidationError[]> {
    return this.validate(output, NormalizedOutputTemplate);
  }

  async validateResponse(response: RESPONSE | RESPONSE[]): Promise<ValidationError[]> {
    return this.validate(response, this.strategy.responseClass);
  }

  async toResponse(
    output: OutputTemplate | OutputTemplate[],
  ): Promise<ReturnType<STRATEGY['toResponse']>> {
    const normalizedOutput = this.strategy.normalizeOutput(output);

    if (this.shouldValidate('before')) {
      const errors = await this.validateOutput(normalizedOutput);
      if (errors.length) {
        throw new OutputValidationError(errors, 'Can not convert.\n');
      }
    }

    const response = this.strategy.toResponse(normalizedOutput);

    if (this.shouldValidate('after')) {
      const errors = await this.validateResponse(response);
      if (errors.length) {
        throw new OutputValidationError(errors, 'Conversion caused invalid response.\n');
      }
    }

    return response as ReturnType<STRATEGY['toResponse']>;
  }

  async fromResponse(
    response: PlainObjectType<RESPONSE> | PlainObjectType<RESPONSE>[],
  ): Promise<ReturnType<STRATEGY['fromResponse']>> {
    const responseInstance = this.strategy.normalizeResponse(response);

    if (this.shouldValidate('before')) {
      const errors = await this.validateResponse(responseInstance);
      if (errors.length) {
        throw new OutputValidationError(errors, 'Can not parse.\n');
      }
    }

    const output = this.strategy.fromResponse(responseInstance);

    if (this.shouldValidate('after')) {
      const errors = await this.validateOutput(output);
      if (errors.length) {
        throw new OutputValidationError(errors, 'Conversion caused invalid output.\n');
      }
    }

    return output as ReturnType<STRATEGY['fromResponse']>;
  }

  private shouldValidate(key?: keyof ValidationConfig): boolean {
    if (!key) {
      return !!this.strategy.config.validation;
    }
    return typeof this.strategy.config.validation === 'object'
      ? this.strategy.config.validation[key]
      : this.strategy.config.validation;
  }

  private async validate<T = unknown>(
    objOrArray: T | T[],
    targetClass: new (...args: unknown[]) => T,
  ): Promise<ValidationError[]> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const getInstance = (item: T) => plainToClass(targetClass, item) as unknown as object;
    if (Array.isArray(objOrArray)) {
      const errorMatrix = await Promise.all(objOrArray.map((item) => validate(getInstance(item))));
      // TODO: maybe modify key or something to indicate better which item was invalid
      return errorMatrix.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []);
    } else {
      return validate(getInstance(objOrArray));
    }
  }
}
