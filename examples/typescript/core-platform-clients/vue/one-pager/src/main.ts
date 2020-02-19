import Vue from 'vue';
import App from './App.vue';

import JovoClientWebVue from 'jovo-client-web-vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import '@/style/element-variables.scss';

Vue.use(Element, { locale });

const WEBHOOK_URL = 'https://webhook.jovo.cloud/<ID>';


Vue.use(JovoClientWebVue, {
  url: WEBHOOK_URL,
  client: {
    debugMode: true,
    locale: 'en-US',
    defaultInputType: 'voice',
  },
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
