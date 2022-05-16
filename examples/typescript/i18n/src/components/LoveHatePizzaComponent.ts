import { BaseComponent, Component, Intents } from '@jovotech/framework';

import { YesNoOutput } from '../output/YesNoOutput';
import { I18nOutput } from '../output/I18nOutput';

@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    // return this.$send(YesNoOutput, { message: this.$t('pizza.prompt') });
    return this.$send(I18nOutput, { key: 'pizza' });
  }

  @Intents('YesIntent')
  lovesPizza() {
    return this.$send({ message: this.$t('pizza.loves') });
  }

  @Intents('NoIntent')
  hatesPizza() {
    return this.$send({ message: this.$t('pizza.hates') });
  }

  UNHANDLED() {
    return this.START();
  }
}
