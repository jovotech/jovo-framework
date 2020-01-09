import { AlexaAPI, ApiCallOptions } from './AlexaAPI';
import { ApiError } from './ApiError';

export interface HouseholdListStatusMap {
  href: string;
  status: string;
}

export interface HouseholdListItem {
  createdTime?: string;
  href?: string;
  id?: string;
  status: string;
  updatedTime?: string;
  value: string;
  version?: number;
}

export interface HouseholdList {
  version: number;
  listId: string;
  name: string;
  state: string;
  statusMap?: HouseholdListStatusMap;
  items?: HouseholdListItem[];
  links?: string;
}

export interface HouseholdLists {
  lists: HouseholdList[];
}

export class AlexaList {
  apiEndpoint: string;
  apiAccessToken: string;

  static ADDRESS = 'address';
  static COUNTRY_AND_POSTAL_CODE = 'address/countryAndPostalCode';

  constructor(apiEndpoint: string, apiAccessToken: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiAccessToken = apiAccessToken;
  }

  /**
   * Returns list by name and status
   * @param {string} name
   * @param {'active'|'completed'} listState
   * @return {Promise}
   */
  async getList(name: string, listState = 'active'): Promise<HouseholdList> {
    const lists: HouseholdLists = await this.getHouseHoldLists();
    for (const list of lists.lists) {
      if (list.name === name && list.state === listState) {
        return this.getListAPI<HouseholdList>(`${list.listId}/${list.state}`);
      }
    }
    throw new ApiError('No list with this name and state was found.');
  }

  /**
   * Adds item to list
   * @param {string} listName
   * @param {string} value
   * @param {string} status
   * @return {Promise}
   */
  async addToList(listName: string, value: string, status = 'active') {
    const list = await this.getList(listName);

    if (!list) {
      throw new ApiError('No list with this name was found.', ApiError.LIST_NOT_FOUND);
    }

    return this.createListItemAPI(list.listId, {
      value,
      status,
    });
  }

  /**
   * Updates item in list by old value (be careful with items with same name)
   * Use updateListItem to update by ids
   * @param {'Alexa shopping list'|'Alexa to-do list'} listName
   * @param {string} oldValue
   * @param {string} newValue
   * @param {'active'|'completed'} newStatus
   * @return {*}
   */
  async updateList(listName: string, oldValue: string, newValue: string, newStatus: string) {
    const list = await this.getList(listName);

    if (!list) {
      throw new ApiError('No list with this name was found.', ApiError.LIST_NOT_FOUND);
    }

    for (const listItem of list.items || []) {
      if (listItem.value.toLowerCase() === oldValue.toLowerCase()) {
        return this.updateListItemAPI(list.listId, {
          id: listItem.id,
          status: newStatus,
          value: newValue,
          version: listItem.version,
        });
      }
    }
    throw new ApiError('No items with this value found.', ApiError.ITEM_NOT_FOUND);
  }

  async deleteListItem(listName: string, value: string, listState = 'active') {
    const list = await this.getList(listName, listState);

    if (!list) {
      throw new ApiError('No list with this name was found.', ApiError.LIST_NOT_FOUND);
    }

    for (const listItem of list.items || []) {
      if (listItem.value.toLowerCase() === value.toLowerCase() && listItem.id) {
        return this.deleteListItemAPI(list.listId, listItem.id);
      }
    }
    throw new ApiError('No items with this value found.', ApiError.ITEM_NOT_FOUND);
  }

  /**
   * Return all household lists
   * @return {*}
   */
  getHouseHoldLists(): Promise<HouseholdLists> {
    return this.getListAPI<HouseholdLists>();
  }

  deleteListItemAPI(listId: string, itemId: string) {
    const options: ApiCallOptions = {
      endpoint: this.apiEndpoint,
      path: `/v2/householdlists/${listId}/items/${itemId}`,
      method: 'DELETE',
      permissionToken: this.apiAccessToken,
    };

    return this.handleApiCall(options);
  }

  // tslint:disable-next-line
  getListAPI<V = any>(path = ''): Promise<V> {
    const options: ApiCallOptions = {
      endpoint: this.apiEndpoint,
      path: `/v2/householdlists/${path}`,
      permissionToken: this.apiAccessToken,
    };

    return this.handleApiCall(options);
  }

  async createListItemAPI(listId: string, householdListItem: HouseholdListItem) {
    const options: ApiCallOptions = {
      endpoint: this.apiEndpoint,
      path: `/v2/householdlists/${listId}/items`,
      method: 'POST',
      json: householdListItem,
      permissionToken: this.apiAccessToken,
    };

    return this.handleApiCall(options);
  }

  async updateListItemAPI(listId: string, householdListItem: HouseholdListItem) {
    const options: ApiCallOptions = {
      endpoint: this.apiEndpoint,
      path: `/v2/householdlists/${listId}/items/${householdListItem.id}`,
      method: 'PUT',
      json: householdListItem,
      permissionToken: this.apiAccessToken,
    };

    return this.handleApiCall(options);
  }

  private async handleApiCall(options: ApiCallOptions) {
    try {
      const response = await AlexaAPI.apiCall(options);
      if (response.status === 403) {
        const { message, code } = response.data;
        const apiError = new ApiError(message, code);
        if (message === 'Not all permissions are authorized.') {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }
        if (message === 'Request is not authorized.') {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }
}
