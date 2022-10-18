import { AxiosError, JovoError, Jovo } from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode, AlexaApiOptions, sendApiRequest } from './AlexaApi';

export type ListMetadata = {
  listId: string;
  name: string;
  state: 'active' | 'archived';
  version: number;
  statusMap: {
    URL: string;
    status: 'active' | 'completed';
  };
};

export type ListMetadataResponse = {
  lists: ListMetadata[];
};

export type ListItem = {
  id: string;
  version: number;
  value: string;
  status: 'active' | 'completed';
  createdTime: string;
  updatedTime: string;
  href: string;
};

// For requests of the type AlexaHouseholdListEvent
export type HouseholdListEventBody = {
  listId?: string;
  listItemIds?: string[];
};

// Available types of default lists
export type ListType = 'shopping-list' | 'todo-list';

export async function getLists(
  apiEndpoint: string,
  permissionToken: string,
): Promise<ListMetadata[]> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/householdlists`,
    permissionToken,
    method: 'GET',
  };
  try {
    const response = await sendApiRequest<ListMetadataResponse>(options);
    return response.data.lists;
  } catch (error) {
    handleListApiErrors(error as AxiosError);
  }
  throw new Error('Unexpected error.');
}

/**
 * Returns the type of the list
 * @param listId List to check
 * @returns the type of the list
 */
export function getTypeOfList(listId: string): ListType {
  const decodedListId = Buffer.from(listId, 'base64').toString('utf8');
  if (decodedListId.endsWith('-SHOPPING_ITEM')) {
    return 'shopping-list';
  } else {
    return 'todo-list';
  }
}

export async function getListItem(
  listId: string,
  itemId: string,
  apiEndpoint: string,
  permissionToken: string,
): Promise<ListItem[]> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/householdlists/${listId}/items/${itemId}`,
    permissionToken,
    method: 'GET',
  };
  try {
    const response = await sendApiRequest<ListItem[]>(options);
    return response.data;
  } catch (error) {
    handleListApiErrors(error as AxiosError);
  }
  throw new Error('Unexpected error.');
}

/**
 * Meaning of error-codes can be found here: https://developer.amazon.com/en-US/docs/alexa/list-skills/list-management-api-reference.html#get-list-item-http-status-codes
 * @param error Error to handle
 */
function handleListApiErrors(error: AxiosError): Error | void {
  if (error.isAxiosError) {
    const { message } = error.response?.data;
    let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

    const status = error.response?.status;
    if (status === 401) {
      errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
    }

    if (status === 404) {
      errorCode = AlexaApiErrorCode.LIST_NOT_FOUND;
    }

    throw new AlexaApiError({ message, code: errorCode });
  }
  throw new JovoError({ message: error.message });
}
