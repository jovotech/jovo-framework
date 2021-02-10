"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("./AlexaAPI");
const ApiError_1 = require("./ApiError");
class AlexaList {
    constructor(apiEndpoint, apiAccessToken) {
        this.apiEndpoint = apiEndpoint;
        this.apiAccessToken = apiAccessToken;
    }
    /**
     * Returns list by name and status
     * @param {string} name
     * @param {'active'|'completed'} listState
     * @return {Promise}
     */
    async getList(name, listState = 'active') {
        const lists = await this.getHouseHoldLists();
        for (const list of lists.lists) {
            if (list.name === name && list.state === listState) {
                return this.getListAPI(`${list.listId}/${list.state}`);
            }
        }
        throw new ApiError_1.ApiError('No list with this name and state was found.');
    }
    /**
     * Adds item to list
     * @param {string} listName
     * @param {string} value
     * @param {string} status
     * @return {Promise}
     */
    async addToList(listName, value, status = 'active') {
        const list = await this.getList(listName);
        if (!list) {
            throw new ApiError_1.ApiError('No list with this name was found.', ApiError_1.ApiError.LIST_NOT_FOUND);
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
    async updateList(listName, oldValue, newValue, newStatus) {
        const list = await this.getList(listName);
        if (!list) {
            throw new ApiError_1.ApiError('No list with this name was found.', ApiError_1.ApiError.LIST_NOT_FOUND);
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
        throw new ApiError_1.ApiError('No items with this value found.', ApiError_1.ApiError.ITEM_NOT_FOUND);
    }
    async deleteListItem(listName, value, listState = 'active') {
        const list = await this.getList(listName, listState);
        if (!list) {
            throw new ApiError_1.ApiError('No list with this name was found.', ApiError_1.ApiError.LIST_NOT_FOUND);
        }
        for (const listItem of list.items || []) {
            if (listItem.value.toLowerCase() === value.toLowerCase() && listItem.id) {
                return this.deleteListItemAPI(list.listId, listItem.id);
            }
        }
        throw new ApiError_1.ApiError('No items with this value found.', ApiError_1.ApiError.ITEM_NOT_FOUND);
    }
    /**
     * Return all household lists
     * @return {*}
     */
    getHouseHoldLists() {
        return this.getListAPI();
    }
    deleteListItemAPI(listId, itemId) {
        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${listId}/items/${itemId}`,
            method: 'DELETE',
            permissionToken: this.apiAccessToken,
        };
        return this.handleApiCall(options);
    }
    // tslint:disable-next-line
    getListAPI(path = '') {
        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${path}`,
            permissionToken: this.apiAccessToken,
        };
        return this.handleApiCall(options);
    }
    async createListItemAPI(listId, householdListItem) {
        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${listId}/items`,
            method: 'POST',
            json: householdListItem,
            permissionToken: this.apiAccessToken,
        };
        return this.handleApiCall(options);
    }
    async updateListItemAPI(listId, householdListItem) {
        const options = {
            endpoint: this.apiEndpoint,
            path: `/v2/householdlists/${listId}/items/${householdListItem.id}`,
            method: 'PUT',
            json: householdListItem,
            permissionToken: this.apiAccessToken,
        };
        return this.handleApiCall(options);
    }
    async handleApiCall(options) {
        try {
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options);
            if (response.status === 403) {
                const { message, code } = response.data;
                const apiError = new ApiError_1.ApiError(message, code);
                if (message === 'Not all permissions are authorized.') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (message === 'Request is not authorized.') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                return Promise.reject(apiError);
            }
            return response.data;
        }
        catch (e) {
            throw new ApiError_1.ApiError(e.message || 'Something went wrong.', e.code || ApiError_1.ApiError.ERROR);
        }
    }
}
exports.AlexaList = AlexaList;
AlexaList.ADDRESS = 'address';
AlexaList.COUNTRY_AND_POSTAL_CODE = 'address/countryAndPostalCode';
//# sourceMappingURL=AlexaList.js.map