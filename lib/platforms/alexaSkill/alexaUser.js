'use strict';
const request = require('request');
const User = require('./../../user').User;

/**
 * Class AlexaUser
 */
class AlexaUser extends User {
    /**
     * Constructoer
     * @param {Platform} platform AlexaSkill instance
     * @param {*} config
     */
    constructor(platform, config) {
        super(platform, config);
        this.alexaList = new AlexaList(this.getPermissionToken());
        this.alexaDeviceAddress = new AlexaDeviceAddress(
            this.getPermissionToken(),
            this.getDeviceId(),
            this.getApiEndpoint());
    }

    /**
     * Returns API endpoint
     * @return {string}
     */
    getApiEndpoint() {
        return this.platform.getApiEndpoint();
    }

    /**
     * Returns permission token
     * @return {string}
     */
    getPermissionToken() {
        return this.platform.getConsentToken();
    }

    /**
     * Returns alexa shopping list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    getShoppingList(status) {
        if (!status) {
            status = 'active';
        }
        return this.alexaList.getList('Alexa shopping list', status);
    }

    /**
     * Returns alexa to do list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    getToDoList(status) {
        return this.alexaList.getList('Alexa to-do list', status);
    }

    /**
     * Adds item to shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToShoppingList(value, status) {
        return this.alexaList.addToList('Alexa shopping list', value, status);
    }

    /**
     * Adds item to to do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToTodoList(value, status) {
        return this.alexaList.addToList('Alexa to-do list', value, status);
    }

    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoList(oldValue, newValue, newStatus) {
        return this.alexaList.updateList('Alexa to-do list', oldValue, newValue, newStatus);
    }

    /**
     * Updates item in shopping list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingList(oldValue, newValue, newStatus) {
        return this.alexaList.updateList('Alexa shopping list', oldValue, newValue, newStatus);
    }

    /**
     * Returns full address of user
     * @return {Promise}
     */
    getDeviceAddress() {
        return this.alexaDeviceAddress.getLocation('address');
    }

    /**
     * Returns country and postal code of user
     * @return {Promise}
     */
    getCountryAndPostalCode() {
        return this.alexaDeviceAddress.getLocation('address/countryAndPostalCode');
    }
}

/**
 * AlexaList Class
 */
class AlexaList {

    /**
     * Constructor
     * @param {string} permissionToken
     */
    constructor(permissionToken) {
        this.permissionToken = permissionToken;
    }

    /**
     * Return all household lists
     * @return {*}
     */
    getHouseHoldLists() {
        return this.requestList('/householdlists/');
    }

    /**
     * List with items from the shopping list
     * @param {'active'|'completed'} status
     * @return {*}
     */
    getShoppingList(status) {
        if (!status) {
            status = 'active';
        }
        return this.getList('Alexa shopping list', status);
    }

    /**
     * List with items from the to do list
     * @param {'active'|'completed'} status
     * @return {*}
     */
    getToDoList(status) {
        if (!status) {
            status = 'active';
        }
        return this.getList('Alexa to-do list', status);
    }

    /**
     * Adds item to shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    addToShoppingList(value, status) {
        if (!status) {
        status = 'active';
    }
        return this.addToList('Alexa shopping list', value, status);
    }

    /**
     * Adds item to to do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    addToTodoList(value, status) {
        if (!status) {
            status = 'active';
        }
        return this.addToList('Alexa to-do list', value, status);
    }

    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoList(oldValue, newValue, newStatus) {
        if (!newStatus) {
            newStatus = 'active';
        }
        return this.updateList('Alexa to-do list', oldValue, newValue, newStatus);
    }

    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingList(oldValue, newValue, newStatus) {
        return this.updateList('Alexa shopping list', oldValue, newValue, newStatus);
    }

    /**
     * Updates item in list by old value (be careful with items with same name)
     * Use updateListItem to update by ids
     * @param {'Alexa shopping list'|'Alexa to-do list'} listType
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateList(listType, oldValue, newValue, newStatus) {
        return new Promise((resolve, reject) => {
            this.getList(listType, 'active')
                .then((data) => {
                    let oldValueItems = data.items.filter( function(el) {
                        return el.value.toUpperCase() === oldValue.toUpperCase();
                    });
                    if (oldValueItems.length === 0) {
                        let error = new Error('No items with this value found');
                        error.code = 'ITEM_NOT_FOUND';
                        reject(error);
                        return;
                    }
                    return this.updateListItem(data.listId, oldValueItems[0].id, {
                            id: oldValueItems[0].id,
                            status: newStatus,
                            value: newValue,
                            version: oldValueItems[0].version,
                        }
                    );
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Adds item to list
     * @param {'Alexa shopping list'|'Alexa to-do list'} listType
     * @param {string} value
     * @param {string} status
     * @return {Promise}
     */
    addToList(listType, value, status) {
        return new Promise((resolve, reject) => {
            this.getList(listType, 'active')
                .then((data) => {
                    return this.createListItem(data.listId, {
                        status: status ? status : 'active',
                        value: value,
                    });
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Updates item in list by item id
     * @param {string} listId
     * @param {string} itemId
     * @param {*} valueObj
     * @return {*}
     */
    updateListItem(listId, itemId, valueObj) {
        return new Promise((resolve, reject) => {
            if (!this.permissionToken) {
                let error = new Error('No permissions from user');
                error.code = 'NO_USER_PERMISSION';
                reject(error);
            }
            let options = {
                url: 'https://api.amazonalexa.com/v2/householdlists/'+listId+'/items/'+itemId,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                json: valueObj,
                auth: {
                    'bearer': this.permissionToken,
                },

            };
            request(options, (error, response, data) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode === 403 && data.type === 'ACCESS_NOT_REQUESTED') {
                    let error = new Error(data.message);
                    error.code = data.type;
                    return reject(error);
                }
                if (response.statusCode === 403 && JSON.parse(data).Message === 'Not all permissions are authorized.') {
                    let error = new Error(JSON.parse(data).Message);
                    error.code = 'NO_USER_PERMISSION';
                    return reject(error);
                }

                resolve(data);
            });
        });
    }

    /**
     * Adds item to list
     * @param {string} listId
     * @param {*} valueObj
     * @return {Promise}
     */
    createListItem(listId, valueObj) {
        return new Promise((resolve, reject) => {
            if (!this.permissionToken) {
                let error = new Error('No permissions from user');
                error.code = 'NO_USER_PERMISSION';
                reject(error);
            }
            let options = {
                url: 'https://api.amazonalexa.com/v2/householdlists/'+listId+'/items',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                json: valueObj,
                auth: {
                    'bearer': this.permissionToken,
                },

            };
            request(options, (error, response, data) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode === 403 && data.type === 'ACCESS_NOT_REQUESTED') {
                    let error = new Error(data.message);
                    error.code = data.type;
                    return reject(error);
                }
                if (response.statusCode === 403 && JSON.parse(data).Message === 'Not all permissions are authorized.') {
                    let error = new Error(JSON.parse(data).Message);
                    error.code = 'NO_USER_PERMISSION';
                    return reject(error);
                }

                resolve(data);
            });
        });
    }


    /**
     * Returns list by name and status
     * @param {string} name
     * @param {'active'|'completed'} listState
     * @return {Promise}
     */
    getList(name, listState) {
        if (!listState) {
            listState = 'active';
        }
        let that = this;
        return new Promise((resolve, reject) => {
            this.getHouseHoldLists()
                .then((data) => {
                    let activeList = data.lists.filter(function(list) {
                        return list.state === listState && list.name === name;
                    });
                    if (activeList) {
                        return that.requestList(
                            '/householdlists/'+activeList[0].listId+'/'+listState
                        );
                    } else {
                        reject();
                    }
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Does the request
     * @private
     * @param {string} path
     * @return {Promise}
     */
    requestList(path) {
        return new Promise((resolve, reject) => {
            if (!this.permissionToken) {
                let error = new Error('No permissions from user');
                error.code = 'NO_USER_PERMISSION';
                reject(error);
            }
            let options = {
                url: 'https://api.amazonalexa.com/v2'+path,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                auth: {
                    'bearer': this.permissionToken,
                },

            };
            request(options, (error, response, data) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode !== 200) {
                    if (data.length === 0) {
                        let error = new Error('HTTP Error code ' + response.statusCode);
                        error.code = 'HTTP_ERROR';
                        return reject(error);
                    }
                    data = JSON.parse(data);

                    // different types of error responses :/
                    if (!data.type) {
                        let error = new Error('No permissions from user');
                        error.code = 'NO_USER_PERMISSION';
                        reject(error);
                    }

                    let error = new Error(data.message);
                    error.code = data.type;
                    return reject(error);
                }

                resolve(JSON.parse(data));
            });
        });
    }
}

/**
 * AlexaDeviceAddress
 */
class AlexaDeviceAddress {

    /**
     * Constructor
     * @param {string} permissionToken
     * @param {string} deviceId
     * @param {string} apiEndpoint
     */
    constructor(permissionToken, deviceId, apiEndpoint) {
        this.permissionToken = permissionToken;
        this.deviceId = deviceId;
        this.apiEndpoint = apiEndpoint;
    }

    /**
     * Returns location by type
     * @param {'address'|'address/countryAndPostalCode'} type
     * @return {Promise}
     */
    getLocation(type) {
        return new Promise((resolve, reject) => {
            if (!this.permissionToken) {
                let error = new Error('No permissions from user');
                error.code = 'NO_USER_PERMISSION';
                reject(error);
            }
            let options = {
                url: this.apiEndpoint + '/v1/devices/' + this.deviceId + '/settings/'+ type,
                headers: {
                    'Accept': 'application/json',
                },
                auth: {
                    'bearer': this.permissionToken,
                },
            };
            request(options, (error, response, data) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode !== 200) {
                    if (data.length === 0) {
                        let error = new Error('HTTP Error code ' + response.statusCode);
                        error.code = 'HTTP_ERROR';
                        return reject(error);
                    }
                    data = JSON.parse(data);
                    let error = new Error(data.message);
                    error.code = data.type;
                    return reject(error);
                }

                resolve(JSON.parse(data));
            });
        });
    }

    /**
     * Returns full address of user
     * @return {*}
     */
    getAddress() {
        return this.getLocation('address');
    }

    /**
     * Returns country and postal code
     * @return {*}
     */
    getCountryAndPostalCode() {
        return this.getLocation('address/countryAndPostalCode');
    }
}


module.exports.AlexaUser = AlexaUser;
