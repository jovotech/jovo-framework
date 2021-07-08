import { OutputTemplate } from '.';

export interface OutputTemplateConverterStrategy<RESPONSE extends Record<string, unknown>> {
  responseClass: new () => RESPONSE;

  toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[];

  fromResponse(response: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[];
}
