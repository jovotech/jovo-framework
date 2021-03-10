import { BaseComponent, Component } from 'jovo-core';

@Component()
export class StandardComponent extends BaseComponent {
  @Global
  LAUNCH() {
    this.$output = {};
  }
}
