import { BaseComponent, Component, Global, Intents } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  @Intents(['HelloWorldIntent'])
  LAUNCH() {
    return this.$redirect(LoveHatePizzaComponent);
  }
}
