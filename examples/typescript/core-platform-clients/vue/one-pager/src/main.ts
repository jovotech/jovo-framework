import Vue from 'vue';
import App from './App.vue';

import JovoClientWebVue from 'jovo-client-web-vue';
import JsonViewer from 'vue-json-viewer';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import '@/style/element-variables.scss';
// @ts-ignore
import VueSocketIO from 'vue-socket.io';
import socketio from 'socket.io-client';
Vue.use(Element, { locale });
Vue.use(JsonViewer);

const WEBHOOK_URL = 'https://webhook.jovo.cloud/alex';

Vue.use(JovoClientWebVue, {
  url: WEBHOOK_URL,
  client: {
    locale: 'en-US',
    speechSynthesis: {
      enabled: false,
    },
    debugMode: true,
    InputComponent: {
      mode: 'push-to-talk',
    },
    ResponseComponent: {
      reprompt: {
        maxAttempts: 3,
        interval: 3000,
      },
    },
    recorder: {},
  },
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
