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
  getDefaultConfig(): PluginConfig {
    return {};
  }

  mount(parent: HandleRequest): Promise<void> | void {
    parent.middlewareCollection.use('response.output', (jovo) => {
      return this.handle(jovo);
    });
  }

  private async handle(jovo: Jovo): Promise<void> {
    const converter = new OutputTemplateConverter(jovo.$platform.outputTemplateConverterStrategy);
    const response = await converter.toResponse(jovo.$output);
    jovo.$response = await jovo.$platform.finalizeResponse(response, jovo);
  }
}
