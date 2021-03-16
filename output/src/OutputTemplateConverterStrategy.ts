import { OutputTemplate } from '.';

export interface OutputTemplateConverterStrategy<Response extends Record<string, unknown>> {
  responseClass: new () => Response;

  toResponse(output: OutputTemplate): Response;
  fromResponse(response: Response): OutputTemplate;
}
