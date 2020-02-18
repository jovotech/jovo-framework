import Vue from 'vue';
import { PluginConfig } from './Interfaces';
import { JovoWebClientVue } from './JovoWebClientVue';

export * from 'jovo-client-web';
export * from './Interfaces';
export * from './JovoWebClientVue';

declare module 'vue/types/vue' {
  interface Vue {
    $assistant: JovoWebClientVue;
  }
}

export function JovoAssistantVuePlugin(vue: typeof Vue, config?: PluginConfig) {
  if (!config) {
    throw new Error(
      `At least the 'url' option has to be set in order to use the JovoWebClientPlugin.`,
    );
  }
  vue.prototype.$assistant = new JovoWebClientVue(config.url, config.client);
}

// tslint:disable-next-line
export default {
  install: JovoAssistantVuePlugin,
};
