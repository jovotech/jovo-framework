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
    const ids = this.$alexa?.$user?.getListIdsFromRequest();
    if (!ids?.listItemIds || !ids?.listId) {
      return;
    }
    const listId = ids.listId;

    console.log(`Added ${ids.listItemIds} to ${listId}`);

    Promise.all(ids.listItemIds.map(itemId => this.$alexa?.$user?.getListItem(listId, itemId)))
        .then(result => console.log('The created items are: ', result))
  }

  // ITEMS UPDATED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsUpdated'],
    platforms: ['alexa'],
  })
  async handleUpdatedItems() {
    const ids = this.$alexa?.$user?.getListIdsFromRequest();
    console.log(`Modified ${ids?.listItemIds} from ${ids?.listId}`);
  }

  // ITEMS DELETED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsDeleted'],
    platforms: ['alexa'],
  })
  async handleDeletedItems() {
    const ids = this.$alexa?.$user?.getListIdsFromRequest();
    console.log(`Deleted ${ids?.listItemIds} from ${ids?.listId}`);
  }
}
