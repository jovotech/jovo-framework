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

    // Issue: It seems like it is impossible to attach reactive data to jovo from a plugin.
    // This means that compared to the vue2-variant, this will require workarounds to use properties of the client.
    // Another solution would be to simply add the client to the data of the Root-component and provide it from there.
    // This would fix the reactivity issue.
    app.config.globalProperties.$client = reactive(new Client(config.url, config.client));
  },
};

export default plugin;

export * from '@jovotech/client-web';
