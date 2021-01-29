import { BaseComponent, Component, Handle } from 'jovo-core';
import { MenuCategoriesComponent } from './MenuCategoriesComponent';

@Component()
export class MenuComponent extends BaseComponent {
  @Handle()
  MenuIntent() {
  }

  @Handle()
  HelpIntent() {}

  showMenuItems() {}
}
