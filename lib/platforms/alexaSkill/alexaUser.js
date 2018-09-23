'use strict';
const User = require('./../../user').User;
const https = require('https');
const _ = require('lodash');

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
        this.alexaList = new AlexaList(this.getPermissionToken(), this.getApiEndpoint());
        this.alexaContact = new AlexaContact(
            this.getPermissionToken(),
            this.getApiEndpoint());

        this.alexaDeviceAddress = new AlexaDeviceAddress(
            this.getPermissionToken(),
            this.getDeviceId(),
            this.getApiEndpoint());

        this.alexaSettingsAPI = new AlexaSettingsAPI(
            this.getDeviceId(),
            this.getApiAccessToken(),
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
     * Returns API endpoint
     * @return {string}
     */
    getApiAccessToken() {
        return this.platform.request.getApiAccessToken();
    }

    /**
     * Returns permission token
     * @return {string}
     */
    getPermissionToken() {
        try {
            return this.platform.getConsentToken();
        } catch (e) {
            return undefined;
        }
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

    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getName() {
        return this.alexaContact.requestContactData('name');
    }

    /**
     * Returns given name of user, if granted
     * @return {Promise}
     */
    getGivenName() {
        return this.alexaContact.requestContactData('given_name');
    }

    /**
     * Returns email of user, if granted
     * @return {Promise}
     */
    getEmail() {
        return this.alexaContact.requestContactData('email');
    }

    /**
     * Returns mobile number user, if granted
     * @return {Promise}
     */
    getMobileNumber() {
        return this.alexaContact.requestContactData('mobile_number');
    }

    /**
     * Returns users' timezone
     * @return {Promise}
     */
    getTimezone() {
        return this.alexaSettingsAPI.request('timeZone');
    }

    /**
     * Returns users' distance measurement unit
     * @return {Promise}
     */
    getDistanceUnit() {
        return this.alexaSettingsAPI.request('distanceUnits');
    }

    /**
     * Returns users' temperature measurement unit
     * @return {Promise}
     */
    getTemperatureUnit() {
        return this.alexaSettingsAPI.request('temperatureUnit');
    }
}

/**
 * AlexaContact class
 */
class AlexaSettingsAPI {
    /**
     * Constructor
     * @param {string} deviceId
     * @param {string} apiAccessToken
     * @param {string} apiEndpoint
     */
    constructor(deviceId, apiAccessToken, apiEndpoint ) {
        this.deviceId = deviceId;
        this.apiAccessToken = apiAccessToken;
        this.apiEndpoint = apiEndpoint;
    }

    /**
     * Does the request
     * @private
     * @param {string} property timeZone|distanceUnits|temperatureUnits|
     * @return {Promise}
     */
    request(property) {
        return new Promise((resolve, reject) => {
            let options = {
                endpoint: this.apiEndpoint,
                path: `/v2/devices/${this.deviceId}/settings/System.${property}`,
                permissionToken: this.apiAccessToken,
            };
            apiCall(options, resolve, reject);
        });
    }
}

/**
 * AlexaContact class
 */
class AlexaContact {
    /**
     * Constructor
     * @param {string} permissionToken
     * @param {string} apiEndpoint
     */
    constructor(permissionToken, apiEndpoint) {
        this.permissionToken = permissionToken;
        this.apiEndpoint = apiEndpoint;
    }

    /**
     * Does the request
     * @private
     * @param {string} property name|given_name|email|mobile_number
     * @return {Promise}
     */
    requestContactData(property) {
        const validProperties = ['name', 'given_name', 'email', 'mobile_number'];
        if (validProperties.indexOf(property) === -1) {
            throw new Error(`${property} is not a valid property`);
        }

        return new Promise((resolve, reject) => {
            if (!this.permissionToken) {
                let error = new Error('No permissions from user');
                error.code = 'NO_USER_PERMISSION';
                reject(error);
            }
            let options = {
                endpoint: this.apiEndpoint,
                path: `/v2/accounts/~current/settings/Profile.${_.camelCase(property)}`,
                permissionToken: this.permissionToken,
            };
            apiCall(options, resolve, reject);
        });
    }
}

/**
 * AlexaList Class
 */
class AlexaList {

    /**
     * Constructor
     * @param {string} permissionToken
     * @param {string} apiEndpoint
     */
    constructor(permissionToken, apiEndpoint) {
        this.permissionToken = permissionToken;
        this.apiEndpoint = apiEndpoint;
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
                endpoint: this.apiEndpoint,
                path: '/v2/householdlists/'+listId+'/items/'+itemId,
                method: 'PUT',
                json: valueObj,
                permissionToken: this.permissionToken,
            };
            apiCall(options, resolve, reject);
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
                endpoint: this.apiEndpoint,
                path: '/v2/householdlists/'+listId+'/items',
                method: 'POST',
                json: valueObj,
                permissionToken: this.permissionToken,
            };
            apiCall(options, resolve, reject);
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
                endpoint: this.apiEndpoint,
                path: '/v2' + path,
                permissionToken: this.permissionToken,
            };

            apiCall(options, resolve, reject);
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
                endpoint: this.apiEndpoint,
                path: '/v1/devices/' + this.deviceId + '/settings/'+ type,
                permissionToken: this.permissionToken,
            };

            apiCall(options, resolve, reject);
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

/**
 * API Call helper
 * @param {*} options
 * @param {*} resolve
 * @param {*} reject
 */
function apiCall(options, resolve, reject) {
    let opt = {
        hostname: options.endpoint.substr(8), // remove https://
        port: 443,
        path: options.path,
        method: options.method ? options.method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + options.permissionToken,
        },
    };
    let postData;
    if (options.json) {
        postData = JSON.stringify(options.json);
        opt.headers['Accept'] = 'application/json';
        opt.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    let req = https.request(opt, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            let parsedData;
            if (res.statusCode === 204) { // no content
                resolve({});
                return;
            }
            try {
                parsedData = JSON.parse(rawData);
            } catch (e) {
                reject(new Error('Something went wrong'));
                return;
            }
            if (res.statusCode !== 200 && res.statusCode !== 201) {
                let error = new Error(parsedData.message || parsedData.Message);
                error.code = parsedData.type || 'ERROR';

                if (res.statusCode === 403 && _.get(parsedData, 'type') === 'ACCESS_NOT_REQUESTED') {
                    error = new Error(parsedData.message);
                    error.code = parsedData.type;
                }
                if (res.statusCode === 403 && _.get(parsedData, 'Message') === 'Not all permissions are authorized.') {
                    error = new Error(parsedData.Message);
                    error.code = 'NO_USER_PERMISSION';
                }

                reject(error);
            } else {
                resolve(parsedData);
            }
        });
    }).on('error', (e) => {
        reject(e);
    });
    if (postData) {
        req.write(postData);
    }

    req.end();
}


module.exports.AlexaUser = AlexaUser;
