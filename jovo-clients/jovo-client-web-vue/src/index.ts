import { Client, Config, DeepPartial } from 'jovo-client-web';
import { PluginObject } from 'vue';

export * from 'jovo-client-web';

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
    if (!config) {
      throw new Error(
        `At least the 'url' option has to be set in order to use the JovoWebClientPlugin. `,
      );
    }
    vue.prototype.$client = new Client(config.url, config.client);
  },
};
export default plugin;
