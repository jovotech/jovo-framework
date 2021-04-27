import { BaseComponent, Component } from '@jovotech/framework';
import { MenuComponent } from './MenuComponent';

@Component()
export class MenuCategoriesComponent extends BaseComponent {


  START() {
    if(this.$googleActions && this.hasScreenInterface()) {

    } else if(this.$googleBusiness && this.$messengerBot) {

    }
  }

  @Intents(['START'])
  @Platforms(['GoogleAssistant'])
  @Condition((handleRequest, jovo) => jovo.hasScreenInterface())
  displayCategoriesSync() {}

  @Intents(['START'])
  @Platforms(['GoogleBusiness', 'FacebookMessenger'])
  displayCategoriesAsync() {}

  @Global
  CategoryIntent() {
    return this.redirect(MenuComponent, 'displayProducts');
  }

  @Intents([{ name: 'CategoryIntent', global: true }])
  @Condition((handleRequest, jovo) => !jovo.$entities.category)
  CategoryIntentWithoutCategory() {
    this.$output = {};
  }

}
