import { Client, Config, DeepPartial } from 'jovo-client-web';
import { PluginObject } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $client: Client;
  }
}

export interface JovoWebClientVueConfig {
  url: string;
  client?: DeepPartial<Config>;
}

const plugin: PluginObject<JovoWebClientVueConfig> = {
  install: (vue, config) => {
    if (!config?.url) {
      throw new Error(
        `At least the 'url' option has to be set in order to use the JovoWebClientPlugin. `,
      );
    }
    const client = new Client(config.url, config.client);
    // make the client reactive
    vue.prototype.$client = vue.observable(client);
  },
};

export default plugin;

export * from 'jovo-client-web';
