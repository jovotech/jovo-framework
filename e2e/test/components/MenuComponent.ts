import { BaseComponent, Component, ComponentDeclaration, Handle } from '@jovotech/framework';
import { ReusableComponent } from './ReusableComponent';

@Component({
  name: 'ComponentDecorator',
  components: [new ComponentDeclaration(ReusableComponent)],
})
export class MenuComponent extends BaseComponent {
  @Handle({ global: true })
  MenuIntent() {}

  @Handle({ global: true, intents: ['MenuIntent'], platforms: ['Alexa', 'GoogleAssistant'] })
  SyncMenuIntent() {}

  @Handle({
    global: true,
    intents: ['MenuIntent'],
    platforms: ['Alexa', 'GoogleAssistant'],
    if: (handleRequest, jovo) => true,
  })
  GoogleAssistantDisplayMenuIntent() {
    console.log('Yes it works :)');
  }

  @Handle({
    global: true,
    intents: ['MenuIntent'],
    platforms: ['FacebookMessenger', 'GoogleBusiness'],
  })
  AsyncMenuIntent() {}

  @Handle({ global: true })
  MenuCategoriesIntent() {}
}
