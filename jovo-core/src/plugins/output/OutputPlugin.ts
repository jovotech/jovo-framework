import { OutputConverter } from 'jovo-output';
import { HandleRequest } from '../../HandleRequest';
import { Jovo } from '../../Jovo';
import { Plugin } from '../../Plugin';

export class OutputPlugin extends Plugin {
  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.get('response.output')?.use(this.handle);
  }

  private async handle(handleRequest: HandleRequest, jovo: Jovo) {
    const converter = new OutputConverter(jovo.platform.outputConverterStrategy);
    // TODO: catch toResponse possible error
    jovo.$response = await converter.toResponse(jovo.$output);
  }
}
