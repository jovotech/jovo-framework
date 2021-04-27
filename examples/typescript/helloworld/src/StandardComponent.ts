import {
  BaseComponent,
  ComponentDeclaration,
  HandleRequest,
  InternalIntent,
  Jovo,
  Component,
  Handle,
} from '@jovotech/framework';

@Component({
  name: 'DecoratorRoot',
  components: [],
})
export class StandardComponent extends BaseComponent {
  @Handle({ global: true, if: (handleRequest: HandleRequest, jovo: Jovo) => true })
  MenuIntent() {
    //
  }

  @Handle({ global: true })
  [InternalIntent.Unhandled]() {}

  // @Routes({ global: true })
  // MenuCategoriesIntent() {}
}
