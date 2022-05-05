import { App } from '@jovotech/framework';
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangEn } from '@nlpjs/lang-en';
import serviceAccount from './service-account.json';

import { GlobalComponent } from './components/GlobalComponent';
import { LoveHatePizzaComponent } from './components/LoveHatePizzaComponent';

/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| All relevant components, plugins, and configurations for your Jovo app
| Learn more here: www.jovo.tech/docs/app-config
|
*/
const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */

  components: [GlobalComponent, LoveHatePizzaComponent],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/docs/plugins, www.jovo.tech/marketplace
  |
  */

  plugins: [
    new GoogleBusinessPlatform({
      serviceAccount, // Used to authenticate with the GBM platform
      plugins: [
        new NlpjsNlu({
          // www.jovo.tech/marketplace/nlu-nlpjs
          languageMap: {
            en: LangEn,
          },
        }),
      ],
    }),
  ],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */

  logging: true,
});

export { app };
