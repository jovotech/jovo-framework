import { Client, InitConfig } from '@jovotech/client-web';
import { PluginObject } from 'vue';

declare global {
  interface Window {
    JovoWebClientVue?: typeof import('.');
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $client: Client;
  }
}

export interface JovoWebClientVueConfig {
  endpointUrl: string;
  config?: InitConfig;
}

const plugin: PluginObject<JovoWebClientVueConfig> = {
  install: (vue, config) => {
    if (!config?.endpointUrl) {
      throw new Error(
        `At least the 'endpointUrl' option has to be set in order to use the JovoWebClientPlugin. `,
      );
    }
    const client = new Client(config.endpointUrl, config.config);
    // make the client reactive
    vue.prototype.$client = vue.observable(client);
  },
};

export default plugin;

export * from '@jovotech/client-web';
