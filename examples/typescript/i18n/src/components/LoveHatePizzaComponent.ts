import { BaseComponent, Component, Intents } from '@jovotech/framework';

import { YesNoOutput } from '../output/YesNoOutput';

@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    return this.$send(YesNoOutput, { message: this.$t('pizza.prompt') });
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
