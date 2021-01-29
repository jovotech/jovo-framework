import { BaseComponent, Component, Handle } from 'jovo-core';

@Component()
export class MenuCategoriesComponent extends BaseComponent {
  @Handle({
    global: true
  })
  MenuCategoriesIntent() {}

  showCategories() {}
}
