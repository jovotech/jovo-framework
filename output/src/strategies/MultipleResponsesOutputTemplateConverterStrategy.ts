import { OutputTemplate } from '../models/OutputTemplate';
import { OutputTemplateConverterStrategy } from '../OutputTemplateConverterStrategy';

export abstract class MultipleResponsesOutputTemplateConverterStrategy<
  RESPONSE extends Record<string, unknown>
> implements OutputTemplateConverterStrategy<RESPONSE> {
  abstract responseClass: new () => RESPONSE;

  fromResponse(response: RESPONSE): OutputTemplate;
  fromResponse(responses: RESPONSE[]): OutputTemplate[];
  fromResponse(response: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[] {
    return Array.isArray(response)
      ? response.map((responseItem) => this.buildOutputTemplate(responseItem))
      : this.buildOutputTemplate(response);
  }

  abstract buildOutputTemplate(response: RESPONSE): OutputTemplate;

  toResponse(output: OutputTemplate): RESPONSE;
  toResponse(outputs: OutputTemplate[]): RESPONSE[];
  toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[] {
    return Array.isArray(output)
      ? output.map((outputItem) => this.buildResponse(outputItem))
      : this.buildResponse(output);
  }

  abstract buildResponse(output: OutputTemplate): RESPONSE;
}
