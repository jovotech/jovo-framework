import {ApiError} from "./ApiError";
import {AlexaAPI} from "./AlexaAPI";

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
    async getList(name: string, listState = 'active') {
        try {
            const lists:HouseholdLists = await this.getHouseHoldLists() as HouseholdLists;
            for (const list of lists.lists) {
                if (list.name === name && list.state === listState) {
                    return await this.getListAPI(`${list.listId}/${list.state}`);
                }
            }
            return Promise.resolve({});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Adds item to list
     * @param {string} listName
     * @param {string} value
     * @param {string} status
     * @return {Promise}
     */
    async addToList(listName: string, value: string, status = 'active') {

        const list = await this.getList(listName) as HouseholdList;
        return await this.createListItemAPI(list.listId, {
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

        const list = await this.getList(listName) as HouseholdList;

        for (const listItem of list.items || []) {
            if (listItem.value.toLowerCase() === oldValue.toLowerCase()) {
                return this.updateListItemAPI(list.listId, {
                    id: listItem.id,
                    status: newStatus,
                    value: newValue,
                    version: listItem.version
                });
            }
        }
        return Promise.reject(
            new ApiError('No items with this value found.', ApiError.ITEM_NOT_FOUND));
    }


    async deleteListItem(listName: string, value: string, listState = 'active') {
        const list = await this.getList(listName, listState) as HouseholdList;

        for (const listItem of list.items || []) {
            if (listItem.value.toLowerCase() === value.toLowerCase() && listItem.id) {
                return this.deleteListItemAPI(list.listId, listItem.id);
            }
        }
        return Promise.reject(
            new ApiError('No items with this value found.', ApiError.ITEM_NOT_FOUND));
    }

    /**
     * Return all household lists
     * @return {*}
     */
    getHouseHoldLists() {
        return this.getListAPI();
    }

    async deleteListItemAPI(listId: string, itemId: string) {

        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${listId}/items/${itemId}`,
            method: 'DELETE',
            permissionToken: this.apiAccessToken,
        };

        try {
            const response:any = await AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.httpStatus === 403) {
                const apiError = new ApiError(response.data.message, response.data.code);
                if (response.data.Message === 'Not all permissions are authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (response.data.Message === 'Request is not authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR));
        }
    }

    async getListAPI(path = '') {

        const options: any = { // tslint:disable-line
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${path}`,
            permissionToken: this.apiAccessToken,
        };

        try {
            const response:any = await AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.httpStatus === 403) {
                const apiError = new ApiError(response.data.message, response.data.code);
                if (response.data.Message === 'Not all permissions are authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (response.data.Message === 'Request is not authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR));
        }
    }

    async createListItemAPI(listId: string, householdListItem: HouseholdListItem) {

        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${listId}/items`,
            method: 'POST',
            json: householdListItem,
            permissionToken: this.apiAccessToken,
        };

        try {
            const response:any = await AlexaAPI.apiCall(options); // tslint:disable-line

            if (response.httpStatus === 403) {
                const apiError = new ApiError(response.data.message, response.data.code);
                if (response.data.Message === 'Not all permissions are authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (response.data.Message === 'Request is not authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR));
        }
    }

    async updateListItemAPI(listId: string, householdListItem: HouseholdListItem) {

        const options = {
            endpoint: this.apiEndpoint,
            path:  `/v2/householdlists/${listId}/items/${householdListItem.id}`,
            method: 'PUT',
            json: householdListItem,
            permissionToken: this.apiAccessToken,
        };

        try {
            const response:any = await AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.httpStatus === 403) {
                const apiError = new ApiError(response.data.message, response.data.code);
                if (response.data.Message === 'Not all permissions are authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (response.data.Message === 'Request is not authorized.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR));
        }
    }

}
