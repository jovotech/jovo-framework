import { Extensible } from '../Extensible';
import { Jovo } from '../Jovo';
import { Plugin, PluginConfig } from '../Plugin';

export interface AnalyticsPluginConfig extends PluginConfig {}

export abstract class AnalyticsPlugin<
  CONFIG extends AnalyticsPluginConfig = AnalyticsPluginConfig,
> extends Plugin<CONFIG> {
  mount(parent: Extensible): Promise<void> | void {
    parent.middlewareCollection.use('after.interpretation.nlu', this.trackRequest.bind(this));
    parent.middlewareCollection.use('after.response.end', this.trackResponse.bind(this));
  }

  abstract trackRequest(jovo: Jovo): Promise<void>;

  abstract trackResponse(jovo: Jovo): Promise<void>;
}
