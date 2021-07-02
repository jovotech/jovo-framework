import { BaseComponent, Component, Handle } from '@jovotech/framework';

@Component()
export class GoogleAssistantRepromptComponent extends BaseComponent {
  @Handle({
    global: true,
    intents: [
      'actions.intent.NO_INPUT_1',
      'actions.intent.NO_INPUT_2',
      'actions.intent.NO_INPUT_FINAL',
    ],
  })
  googleAssistantNoInput(): void {
    this.$output = {
      message: 'No input reached',
    };
    if (this.$state?.length) {
      this.$state.splice(this.$state.length - 1, 1);
    }
  }
}
