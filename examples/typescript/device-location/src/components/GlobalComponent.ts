import { Component, BaseComponent, Global } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    console.log('here2');
    return this.$redirect(LoveHatePizzaComponent);
  }
}
