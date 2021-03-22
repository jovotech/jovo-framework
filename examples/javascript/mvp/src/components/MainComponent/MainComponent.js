import { Component, Handle, BaseComponent } from '@jovotech/framework';
import { WelcomeOutput } from './output/WelcomeOutput';

@Component()
export class MainComponent extends BaseComponent {

  @Handle({
    global: true
  })
  LAUNCH() {
    return this.$send(WelcomeOutput);
  }

}
