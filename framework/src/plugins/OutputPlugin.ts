import { OutputTemplateConverter } from '@jovotech/output';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { Plugin, PluginConfig } from '../Plugin';

export interface OutputPluginConfig extends PluginConfig {}

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    OutputPlugin?: OutputPluginConfig;
  }

  interface ExtensiblePlugins {
    OutputPlugin?: OutputPlugin;
  }
}

export class OutputPlugin extends Plugin<OutputPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.get('response.output')?.use(this.handle);
  }

  private handle = async (handleRequest: HandleRequest, jovo: Jovo) => {
    const converter = new OutputTemplateConverter(jovo.$platform.outputTemplateConverterStrategy);
    // TODO: catch possible errors
    const response = await converter.toResponse(jovo.$output);
    jovo.$response = await jovo.$platform.finalizeResponse(response, jovo);
  };
}
