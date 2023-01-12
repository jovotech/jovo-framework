import { BaseComponent, Component, Global } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  async LAUNCH() {
    // await this.$inbox.send({ foo: 'bar' });

    return this.$redirect(LoveHatePizzaComponent);
  }
}
