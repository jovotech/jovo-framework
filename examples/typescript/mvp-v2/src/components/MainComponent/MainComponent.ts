import { Component, Handle, BaseComponent } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Component({
  components: [],
})
export class MainComponent extends BaseComponent {
  @Handle({
    global: true,
  })
  async LAUNCH() {
    await this.$redirect(LoveHatePizzaComponent);
  }
}
