import { Component, Handle, BaseComponent } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';
import { LovesPizzaOutput } from './output/LovesPizzaOutput';
import { AskForPizzaLoveOutput } from './output/AskForPizzaLoveOutput';

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
