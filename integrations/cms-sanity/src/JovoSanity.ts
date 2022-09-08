import { Jovo, JovoError } from '@jovotech/framework';
import SanityClient from '@sanity/client';
import { SanityCms, SanityCmsConfig } from './SanityCms';
import { BaseSanityQueryTransformer } from './transformers';

export class JovoSanity {
  readonly client: any;

  constructor(readonly sanityCms: SanityCms, readonly jovo: Jovo) {
    this.client = new SanityClient(this.config.client);
  }

  get config(): SanityCmsConfig {
    return this.sanityCms.config;
  }

  async load(queryKeys: string | string[]): Promise<void> {
    const names = Array.isArray(queryKeys) ? queryKeys : [queryKeys];
    const promises = [];

    for (const [name, value] of Object.entries(this.config.queries)) {
      if (names.includes(name)) {
        const transformer =
          typeof value === 'string' ? null : (value as BaseSanityQueryTransformer);
        const query: string = transformer ? transformer.config.query : (value as string);

        if (!query) continue;

        promises.push({ name, transformer, query, data: this.client.fetch(query) });
      }
    }

    if (promises.length > 0) {
      const allPromises = await Promise.all(promises);

      for (const p of allPromises) {
        try {
          const data = await p.data;

          if (p.transformer) {
            this.jovo.$cms[p.name] = p.transformer.execute(data, this.jovo);
          } else {
            this.jovo.$cms[p.name] = data;
          }
        } catch (error) {
          throw new JovoError({ message: (error as Error).message });
        }
      }
    }
  }
}
