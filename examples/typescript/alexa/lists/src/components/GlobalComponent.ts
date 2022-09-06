import { BaseComponent, Component, Global, Handle, Jovo } from '@jovotech/framework';
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
    const { listId, listItemIds } = getIdsFromRequest(this);
    console.log(`Added ${listItemIds} to ${listId}`);

    if (!listItemIds || !listId) {
      return;
    }
    Promise.all(listItemIds.map(itemId => this.$alexa?.$user?.getListItem(listId, itemId)))
        .then(result => console.log('The created items are: ', result))
  }

  // ITEMS UPDATED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsUpdated'],
    platforms: ['alexa'],
  })
  async handleUpdatedItems() {
    const { listId, listItemIds } = getIdsFromRequest(this);
    console.log(`Modified ${listItemIds} from ${listId}`);
  }

  // ITEMS DELETED
  @Handle({
    global: true,
    types: ['AlexaHouseholdListEvent.ItemsDeleted'],
    platforms: ['alexa'],
  })
  async handleDeletedItems() {
    const { listId, listItemIds } = getIdsFromRequest(this);
    console.log(`Deleted ${listItemIds} from ${listId}`);
  }
}

type ListItemRequest = {
  listId?: string;
  listItemIds?: string[];
};

function getIdsFromRequest(jovo: Jovo): ListItemRequest {
  const alexaRequest = jovo.$alexa?.$request;
  const request = alexaRequest?.request;

  const body = request?.body as ListItemRequest;

  return {
    listId: body?.listId,
    listItemIds: body?.listItemIds,
  };
}
