import _Vue from 'vue';
import { PluginOptions } from './Interfaces';
import { JovoWebClientVue } from './JovoWebClientVue';

export * from 'jovo-client-web';

declare module 'vue/types/vue' {
  interface Vue {
    $assistant: JovoWebClientVue;
  }
}

export function JovoAssistantVuePlugin(vue: typeof _Vue, options?: PluginOptions) {
  if (!options) {
    throw new Error(
      `At least the 'url' option has to be set in order to use the JovoWebClientPlugin.`,
    );
  }
  vue.prototype.$assistant = new JovoWebClientVue(options.url, options.client);
}

// tslint:disable-next-line
export default {
  install: JovoAssistantVuePlugin,
};
