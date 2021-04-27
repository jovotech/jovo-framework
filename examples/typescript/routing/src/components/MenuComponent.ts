import { Jovo } from '@jovotech/framework';
import { BaseComponent, Component } from '@jovotech/framework';
import { MenuCategoriesComponent } from './MenuCategoriesComponent';

function hasMultipleCategories(jovo: Jovo): boolean {
  return (
    jovo.$data.Ignite360Data.menuCategories?.length &&
    jovo.$data.Ignite360Data.menuCategories?.length > 1
  );
}

function hasSingleOrNoCategory(jovo: Jovo): boolean {
  return (
    !jovo.$data.Ignite360Data.menuCategories?.length ||
    jovo.$data.Ignite360Data.menuCategories.length === 1
  );
}

export function If(): MethodDecorator {
  return function (target, propertyKey, descriptor) {

  }
}

@Component({
  components: [MenuCategoriesComponent],
})
export class MenuComponent extends BaseComponent {
  @Global
  async MenuIntent() {
    this.$output = {};
  }

  // THIS is the way
  @Handle({
    type: 'START',
    intents: ['intent'],
    touch: [],
    platforms: [],
    if: () => false,
  })

  @Handle({
    type: 'START',
    intents: [],
    touch: ['select'],
    platforms: [],
    if: () => false,
  })

  @Global()
  @Intents([{ name: 'MenuIntent', global: true }])
  @Touch({name: 'abc', global: true})

  @Platforms(['GoogleAssistant', 'GoogleBusiness', 'FacebookMessenger'])
  @Condition(
    (handleRequest, jovo) =>
      hasMultipleCategories(jovo) && (jovo.$googleAction ? jovo.hasScreenInterface() : true),
  )
  async MenuMultipleCategoriesWithDisplay() {
    return this.redirect(MenuCategoriesComponent);
  }

  @Intents([{ name: 'MenuIntent', global: true }])
  @Platforms(['GoogleAssistant', 'GoogleBusiness', 'FacebookMessenger'])
  @If(
    (handleRequest, jovo) =>
      hasSingleOrNoCategory(jovo) && (jovo.$googleAction ? jovo.hasScreenInterface() : true),
  )
  MenuSingleOrNoCategoryWithDisplay() {
    this.$output = {};
    return this.displayProducts();
  }

  displayProducts() {}
}
