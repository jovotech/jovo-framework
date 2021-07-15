import _merge from 'lodash.merge';
import { OutputTemplate } from '.';

export abstract class OutputTemplateConverterStrategy<RESPONSE extends Record<string, unknown>> {
  abstract responseClass: new () => RESPONSE;

  abstract toResponse(output: OutputTemplate | OutputTemplate[]): RESPONSE | RESPONSE[];

  abstract fromResponse(response: RESPONSE | RESPONSE[]): OutputTemplate | OutputTemplate[];

  createResponseInstance(response: RESPONSE | Record<string, unknown>): RESPONSE {
    const instance: RESPONSE = new this.responseClass();
    _merge(instance, response);
    return instance;
  }
}
