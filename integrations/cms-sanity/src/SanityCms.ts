import { App, Jovo, Plugin, PluginConfig, JovoError } from '@jovotech/framework';
import { BaseSanityQueryTransformer } from './transformers';
import SanityClient from '@sanity/client';

export interface SanityCmsConfig extends PluginConfig {
  client: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    token: string;
    useCdn: boolean;
  };
  queries: Record<string, string | BaseSanityQueryTransformer>;
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
    const client = new SanityClient(this.config.client);
    const promises = [];

    for (const [name, value] of Object.entries(this.config.queries)) {
      const transformer = typeof value === 'string' ? null : (value as BaseSanityQueryTransformer);
      const query: string = transformer ? transformer.config.query : (value as string);

      if (!query) continue;

      promises.push({ name, transformer, query, data: client.fetch(query) });
    }

    const allPromises = await Promise.all(promises);

    for (const p of allPromises) {
      try {
        const data = await p.data;

        if (p.transformer) {
          jovo.$cms[p.name] = p.transformer.execute(data, jovo);
        } else {
          jovo.$cms[p.name] = data;
        }
      } catch (error) {
        throw new JovoError({ message: (error as Error).message });
      }
    }
  }
}
