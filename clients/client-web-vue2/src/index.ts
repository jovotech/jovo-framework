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

export type PluginConfig = JovoWebClientVueConfig | Client;

export * from '@jovotech/client-web';

const plugin: PluginObject<PluginConfig> = {
  install: (vue, configOrClient) => {
    if (!(configOrClient instanceof Client)) {
      if (!configOrClient?.endpointUrl) {
        throw new Error(
          `At least the 'endpointUrl' option has to be set in order to use the JovoWebClientPlugin. `,
        );
      }
      configOrClient = new Client(configOrClient.endpointUrl, configOrClient.config);
    }
    // make the client reactive
    vue.prototype.$client = vue.observable(configOrClient);
  },
};

export default plugin;
