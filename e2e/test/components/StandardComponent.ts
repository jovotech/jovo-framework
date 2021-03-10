import { BaseComponent, Component, ComponentDeclaration, Handle, InternalIntent } from 'jovo-core';
import { MenuComponent } from './MenuComponent';

@Component({
  name: 'DecoratorRoot',
  components: [new ComponentDeclaration(MenuComponent, { name: 'ChildComponentDeclaration' })],
})
export class StandardComponent extends BaseComponent {
  @Handle({ global: true, if: (handleRequest, jovo) => true })
  MenuIntent() {}

  @Handle({ global: true })
  [InternalIntent.Unhandled]() {}

  // @Routes({ global: true })
  // MenuCategoriesIntent() {}
}
