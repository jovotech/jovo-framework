import { BaseComponent, Component, Handle } from 'jovo-core';
import { MenuCategoriesComponent } from './MenuCategoriesComponent';

@Component({
  components: [MenuCategoriesComponent],
})
export class MenuComponent extends BaseComponent {
  @Handle({ global: true, intents: ['LAUNCH', 'StartIntent'] })
  MenuIntent() {}

  @Handle()
  HelpIntent() {}

  showMenuItems() {}
}
