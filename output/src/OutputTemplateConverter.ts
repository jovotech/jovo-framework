import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { OutputValidationError } from './errors/OutputValidationError';
import { OutputTemplate, JovoResponse, OutputTemplateConverterStrategy } from './index';

// TODO: check if validation should happen before and after conversion
export class OutputTemplateConverter<Response extends JovoResponse> {
  constructor(public strategy: OutputTemplateConverterStrategy<Response>) {}

  validateOutput(output: OutputTemplate): Promise<ValidationError[]> {
    const instance = output instanceof OutputTemplate ? output : plainToClass(OutputTemplate, output);
    return validate(instance);
  }

  validateResponse(response: Response): Promise<ValidationError[]> {
    const instance =
      response instanceof this.strategy.responseClass
        ? response
        : plainToClass(this.strategy.responseClass, response);
    return validate(instance);
  }

  async toResponse(output: OutputTemplate): Promise<Response> {
    const outputInstance = plainToClass(OutputTemplate, output);
    let errors = await this.validateOutput(outputInstance);
    if (errors.length) {
      throw new OutputValidationError(errors, 'Can not convert.\n');
    }
    const response = this.strategy.toResponse(outputInstance);
    errors = await this.validateResponse(response);
    if (errors.length) {
      throw new OutputValidationError(errors, 'Conversion caused invalid response.\n');
    }
    return response;
  }

  async fromResponse(response: Response): Promise<OutputTemplate> {
    const responseInstance = plainToClass(this.strategy.responseClass, response);
    let errors = await this.validateResponse(responseInstance);
    if (errors.length) {
      throw new OutputValidationError(errors, 'Can not parse.\n');
    }
    const output = this.strategy.fromResponse(responseInstance);
    errors = await this.validateOutput(output);
    if (errors.length) {
      throw new OutputValidationError(errors, 'Conversion caused invalid output.\n');
    }
    return output;
  }
}
