import { Component, Handle, BaseComponent } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Component({
  components: [LoveHatePizzaComponent]
})
export class MainComponent extends BaseComponent {

  @Handle({
    global: true
  })
  LAUNCH() {
    return this.$redirect(LoveHatePizzaComponent);
  }
}