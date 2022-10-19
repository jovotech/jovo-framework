import { BaseComponent, Component, Global, Handle } from '@jovotech/framework';

import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$redirect(LoveHatePizzaComponent);
  }

  // ITEMS CREATED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsCreated'],
    platforms: ['alexa'],
  })
  handleCreatedItems() {
    const body = this.$alexa!.$request.request!.body;
    if (!body?.listItemIds || !body?.listId) {
      return;
    }
    const listId = body.listId;

    console.log(`Added ${body.listItemIds} to ${listId}`);

    this.$alexa!.$user?.getListItems(listId, body.listItemIds)
        .then(result => console.log('The created items are: ', result))
  }

  // ITEMS UPDATED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsUpdated'],
    platforms: ['alexa'],
  })
  async handleUpdatedItems() {
    const body = this.$alexa!.$request.request!.body;
    console.log(`Modified ${body?.listItemIds} from ${body?.listId}`);
  }

  // ITEMS DELETED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsDeleted'],
    platforms: ['alexa'],
  })
  async handleDeletedItems() {
    const body = this.$alexa!.$request.request!.body;
    console.log(`Deleted ${body?.listItemIds} from ${body?.listId}`);
  }
}
