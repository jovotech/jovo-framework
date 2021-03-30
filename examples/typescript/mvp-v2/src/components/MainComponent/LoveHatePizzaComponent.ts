import { Component, Handle, BaseComponent } from '@jovotech/framework';
import { AskForPizzaLoveOutput } from './output/AskForPizzaLoveOutput';
import { LovesPizzaOutput } from './output/LovesPizzaOutput';
import { HatesPizzaOutput } from './output/HatesPizzaOutput';

@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    return this.$send(AskForPizzaLoveOutput);
  }

  @Handle({
    intents: ['YesIntent', 'AMAZON.YesIntent'],
  })
  LovesPizza() {
    return this.$send(LovesPizzaOutput);
  }

  @Handle({
    intents: ['NoIntent', 'AMAZON.NoIntent'],
  })
  HatesPizza() {
    return this.$send(HatesPizzaOutput);
  }

  UNHANDLED() {
    return this.START();
  }
}
