import { NormalizedOutputTemplate } from '../models/NormalizedOutputTemplate';
import { OutputTemplate } from '../models/OutputTemplate';
import {
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
} from '../OutputTemplateConverterStrategy';

/**
 * Strategy that can have multiple OutputTemplates and multiple Responses.
 */
export abstract class MultipleResponsesOutputTemplateConverterStrategy<
  RESPONSE extends Record<string, unknown>,
  CONFIG extends OutputTemplateConverterStrategyConfig,
> extends OutputTemplateConverterStrategy<RESPONSE, CONFIG> {
  normalizeOutput(
    output: OutputTemplate | OutputTemplate[],
  ): NormalizedOutputTemplate | NormalizedOutputTemplate[] {
    const normalizedOutput = super.normalizeOutput(output);
    if (!this.shouldSanitize()) {
      return normalizedOutput;
    }
    return Array.isArray(normalizedOutput)
      ? normalizedOutput.map((outputItem, index) => this.sanitizeOutput(outputItem, index))
      : this.sanitizeOutput(normalizedOutput);
  }

  protected abstract sanitizeOutput(
    output: NormalizedOutputTemplate,
    index?: number,
  ): NormalizedOutputTemplate;

  abstract convertOutput(output: NormalizedOutputTemplate): RESPONSE | RESPONSE[];
  abstract convertResponse(response: RESPONSE): NormalizedOutputTemplate;

  toResponse(output: NormalizedOutputTemplate | NormalizedOutputTemplate[]): RESPONSE | RESPONSE[] {
    return Array.isArray(output)
      ? output
          .map((outputItem) => this.convertOutput(outputItem))
          .reduce((accumulator: RESPONSE[], currentValue) => {
            if (Array.isArray(currentValue)) {
              accumulator.push(...currentValue);
            } else {
              accumulator.push(currentValue);
            }
            return accumulator;
          }, [])
      : this.convertOutput(output);
  }

  fromResponse(
    responseOrResponses: RESPONSE | RESPONSE[],
  ): NormalizedOutputTemplate | NormalizedOutputTemplate[] {
    return Array.isArray(responseOrResponses)
      ? responseOrResponses.map((responseItem) => this.convertResponse(responseItem))
      : this.convertResponse(responseOrResponses);
  }
}
