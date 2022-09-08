import { App, Jovo, Plugin, PluginConfig, JovoError } from '@jovotech/framework';
import { JovoSanity } from './JovoSanity';
import { BaseSanityQueryTransformer } from './transformers';

export interface SanityCmsConfig extends PluginConfig {
  client: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    token: string;
    useCdn: boolean;
  };
  queries: Record<string, string | BaseSanityQueryTransformer>;
  autoLoad?: string[];
}

export class SanityCms extends Plugin<SanityCmsConfig> {
  getDefaultConfig(): SanityCmsConfig {
    return {
      client: {
        projectId: '',
        dataset: '',
        apiVersion: new Date().toISOString().split('T')[0],
        token: '',
        useCdn: true,
      },
      queries: {},
    };
  }

  install(app: App): void {
    app.middlewareCollection.use('request.start', this.retrieveSanityData.bind(this));

    if (!this.config.client.projectId) {
      throw new JovoError({
        message: 'projectId has to be set',
        hint: 'You can find your api key on https://manage.sanity.io',
        learnMore: 'https://www.sanity.io/docs/connect-your-content',
      });
    }

    if (!this.config.client.dataset) {
      throw new JovoError({
        message: 'dataset has to bet set',
        hint: 'You can find your baseId on https://manage.sanity.io',
        learnMore: 'https://www.sanity.io/docs/connect-your-content',
      });
    }
  }

  async retrieveSanityData(jovo: Jovo): Promise<void> {
    let queryKeys: string[] = [];

    if (this.config.autoLoad) {
      queryKeys = Object.keys(this.config.queries).filter((x) => this.config.autoLoad!.includes(x));
    } else {
      queryKeys = Object.keys(this.config.queries);
    }

    jovo.$sanity = new JovoSanity(this, jovo);

    if (queryKeys.length > 0) {
      await jovo.$sanity.load(queryKeys);
    }
  }
}
