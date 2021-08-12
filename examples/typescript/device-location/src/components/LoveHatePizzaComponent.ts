import { Component, BaseComponent, Intents } from '@jovotech/framework';

import { YesNoOutput } from '../output/YesNoOutput';

@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    return this.$send(YesNoOutput, { message: 'Do you like Pizza?' });
  }

  @Intents(['YesIntent'])
  lovesPizza() {
    return this.$send({ message: 'Yes! I love pizza, too.' });
  }

  @Intents(['NoIntent'])
  hatesPizza() {
    return this.$send({ message: `That's OK! Not everyone likes pizza.` });
  }

  UNHANDLED() {
    return this.START();
  }
}
