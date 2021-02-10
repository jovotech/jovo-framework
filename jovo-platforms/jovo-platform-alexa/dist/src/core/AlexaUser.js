"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const AlexaContact_1 = require("../services/AlexaContact");
const AlexaSettings_1 = require("../services/AlexaSettings");
const AlexaDeviceAddress_1 = require("../services/AlexaDeviceAddress");
const AlexaList_1 = require("../services/AlexaList");
const AlexaReminder_1 = require("../services/AlexaReminder");
const AmazonPayAPI_1 = require("../services/AmazonPayAPI");
const AlexaTimer_1 = require("../services/AlexaTimer");
class AlexaUser extends jovo_core_1.User {
    constructor(alexaSkill) {
        super(alexaSkill);
        this.alexaSkill = alexaSkill;
        const alexaRequest = this.alexaSkill.$request;
        this.alexaList = new AlexaList_1.AlexaList(alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
        this.alexaReminder = new AlexaReminder_1.AlexaReminder(alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
        this.alexaTimer = new AlexaTimer_1.AlexaTimer(alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    }
    getAccessToken() {
        return this.alexaSkill.$request.getAccessToken();
    }
    getId() {
        return this.alexaSkill.$request.getUserId();
    }
    /**
     * Returns a personId associated with a voice profile.
     * @returns {string}
     */
    getPersonId() {
        const alexaRequest = this.alexaSkill.$request;
        return alexaRequest.getPersonId();
    }
    /**
     * Returns alexa shopping list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    async getShoppingList(status = 'active') {
        const list = await this.alexaList.getList('Alexa shopping list', status);
        if (!list.items) {
            list.items = [];
        }
        return list;
    }
    /**
     * Returns alexa to do list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    async getToDoList(status = 'active') {
        const list = await this.alexaList.getList('Alexa to-do list', status);
        if (!list.items) {
            list.items = [];
        }
        return list;
    }
    /**
     * Adds item to shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToShoppingList(value, status = 'active') {
        return this.alexaList.addToList('Alexa shopping list', value, status);
    }
    //
    /**
     * Adds item to to do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToToDoList(value, status = 'active') {
        return this.alexaList.addToList('Alexa to-do list', value, status);
    }
    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoList(oldValue, newValue, newStatus = 'active') {
        return this.alexaList.updateList('Alexa to-do list', oldValue, newValue, newStatus);
    }
    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoListItem(oldValue, newValue, newStatus = 'active') {
        return this.updateToDoList(oldValue, newValue, newStatus);
    }
    /**
     * Updates item in shopping list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingList(oldValue, newValue, newStatus = 'active') {
        return this.alexaList.updateList('Alexa shopping list', oldValue, newValue, newStatus);
    }
    /**
     * Updates item in shopping list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingListItem(oldValue, newValue, newStatus = 'active') {
        return this.updateShoppingList(oldValue, newValue, newStatus);
    }
    /**
     * Deletes item from shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    deleteShoppingListItem(value, status = 'active') {
        return this.alexaList.deleteListItem('Alexa shopping list', value, status);
    }
    /**
     * Deletes item from to-do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    deleteToDoListItem(value, status = 'active') {
        return this.alexaList.deleteListItem('Alexa to-do list', value, status);
    }
    /**
     * Returns full address of user
     * @return {Promise}
     */
    getDeviceAddress() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.ADDRESS, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken(), alexaRequest.getDeviceId());
    }
    /**
     * Returns country and postal code of user
     * @return {Promise}
     */
    getCountryAndPostalCode() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.COUNTRY_AND_POSTAL_CODE, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken(), alexaRequest.getDeviceId());
    }
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getName() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    }
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getFullName() {
        return this.getName();
    }
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getEmail() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.EMAIL, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    }
    /**
     * Returns given name of user, if granted
     * @return {Promise}
     */
    getGivenName() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.GIVEN_NAME, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    }
    /**
     * Returns mobile number user, if granted
     * @return {Promise}
     */
    getMobileNumber() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.MOBILE_NUMBER, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    }
    /**
     * Returns users' timezone
     * @return {Promise}
     */
    getTimezone() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TIMEZONE, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken(), alexaRequest.getDeviceId());
    }
    /**
     * Returns users' distance measurement unit
     * @return {Promise}
     */
    getDistanceUnit() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.DISTANCE_UNITS, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken(), alexaRequest.getDeviceId());
    }
    /**
     * Returns users' temperature measurement unit
     * @return {Promise}
     */
    getTemperatureUnit() {
        const alexaRequest = this.alexaSkill.$request;
        return AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TEMPERATURE_UNITS, alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken(), alexaRequest.getDeviceId());
    }
    /**
     * Sets reminder
     * @param {*} reminder
     * @return {Promise<any>}
     */
    setReminder(reminder) {
        return this.alexaReminder.setReminder(reminder);
    }
    /**
     * Gets reminder
     * @param {string} alertToken
     * @return {Promise<any>}
     */
    getReminder(alertToken) {
        return this.alexaReminder.getReminder(alertToken);
    }
    /**
     * Updates reminder
     * @param {string} alertToken
     * @param {*} reminder
     * @return {Promise<any>}
     */
    updateReminder(alertToken, reminder) {
        return this.alexaReminder.updateReminder(alertToken, reminder);
    }
    /**
     * Deletes reminder
     * @param {string} alertToken
     * @return {Promise<void>}
     */
    deleteReminder(alertToken) {
        return this.alexaReminder.deleteReminder(alertToken);
    }
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllReminders() {
        return this.alexaReminder.getAllReminders();
    }
    /**
     * Sets timer
     * @return {Promise<any>}
     */
    setTimer(timer) {
        return this.alexaTimer.setTimer(timer);
    }
    /**
     * Gets specific timer
     * @param {string} id
     * @return {Promise<any>}
     */
    getTimer(id) {
        return this.alexaTimer.getTimer(id);
    }
    /**
     * Cancel timer
     * @param {string} id
     * @return {Promise<void>}
     */
    cancelTimer(id) {
        return this.alexaTimer.cancelTimer(id);
    }
    /**
     * Cancel all timers
     * @return {Promise<void>}
     */
    cancelAllTimers() {
        return this.alexaTimer.cancelAllTimers();
    }
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllTimers() {
        return this.alexaTimer.getAllTimers();
    }
    getBuyerId(options) {
        if (!options) {
            options = {};
        }
        const alexaRequest = this.alexaSkill.$request;
        if (!options.apiAccessToken) {
            options.apiAccessToken = alexaRequest.getApiAccessToken();
        }
        if (!options.host) {
            options.host = AmazonPayAPI_1.AmazonPayAPI.mapAlexaApiEndpointToAmazonPayApiHost(alexaRequest.getApiEndpoint());
        }
        return AmazonPayAPI_1.AmazonPayAPI.getBuyerId(options);
    }
    getBuyerAddress(options) {
        const alexaRequest = this.alexaSkill.$request;
        if (!options.apiAccessToken) {
            options.apiAccessToken = alexaRequest.getApiAccessToken();
        }
        if (!options.host) {
            options.host = AmazonPayAPI_1.AmazonPayAPI.mapAlexaApiEndpointToAmazonPayApiHost(alexaRequest.getApiEndpoint());
        }
        return AmazonPayAPI_1.AmazonPayAPI.getBuyerAddress(options);
    }
    async getDefaultBuyerAddress(options) {
        const { addresses } = await this.getBuyerAddress(options);
        const defaultAddress = addresses.find((address) => {
            return address.addressType === 'DefaultOneClickShippingAddress';
        });
        return defaultAddress;
    }
}
exports.AlexaUser = AlexaUser;
//# sourceMappingURL=AlexaUser.js.map