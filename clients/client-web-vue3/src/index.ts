import { Client, InitConfig } from '@jovotech/client-web';
import { Plugin, reactive, ref } from 'vue';

declare global {
  interface Window {
    JovoWebClientVue?: typeof import('.');
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $client: Client;
  }
}

export interface JovoWebClientVueConfig {
  url: string;
  client?: InitConfig;
}

const plugin: Plugin = {
  install: (app, config) => {
    if (!config?.url) {
      throw new Error(
        `At least the 'url' option has to be set in order to use the JovoWebClientPlugin. `,
      );
    }

    // this is probably not working because the new reactivity system of vue is much worse in v3
    app.config.globalProperties.$client = reactive(new Client(config.url, config.client));
  },
};

export default plugin;

export * from '@jovotech/client-web';
