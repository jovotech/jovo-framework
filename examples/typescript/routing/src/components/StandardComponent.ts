import { BaseComponent, Component } from '@jovotech/framework';

@Component()
export class StandardComponent extends BaseComponent {
  @Global
  LAUNCH() {
    this.$output = {};
  }
}
