import { BaseComponent, Component } from '@jovotech/core';

@Component()
export class StandardComponent extends BaseComponent {
  @Global
  LAUNCH() {
    this.$output = {};
  }
}
