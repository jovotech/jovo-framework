import { OutputTemplate } from '../models/OutputTemplate';
import { OutputTemplateConverterStrategy } from '../OutputTemplateConverterStrategy';

export abstract class MultipleResponsesOutputTemplateConverterStrategy<
  RESPONSE extends Record<string, unknown>,
> extends OutputTemplateConverterStrategy<RESPONSE> {
  fromResponse(response: RESPONSE): OutputTemplate;
  fromResponse(responses: RESPONSE[]): OutputTemplate[];
  fromResponse(responseOrResponses: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[] {
    return Array.isArray(responseOrResponses)
      ? responseOrResponses.map((responseItem) => this.convertResponse(responseItem))
      : this.convertResponse(responseOrResponses);
  }

  abstract convertResponse(response: RESPONSE): OutputTemplate;

  toResponse(output: OutputTemplate): RESPONSE;
  toResponse(outputs: OutputTemplate[]): RESPONSE[];
  toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[] {
    return Array.isArray(output)
      ? output
          .map((outputItem) => this.convertTemplate(outputItem))
          .reduce((accumulator: RESPONSE[], currentValue) => {
            if (Array.isArray(currentValue)) {
              accumulator.push(...currentValue);
            } else {
              accumulator.push(currentValue);
            }
            return accumulator;
          }, [])
      : this.convertTemplate(output);
  }

  abstract convertTemplate(output: OutputTemplate): RESPONSE | RESPONSE[];
}
