import { User, Jovo } from 'jovo-core';
import { AlexaContact } from '../services/AlexaContact';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSettings } from '../services/AlexaSettings';
import {
  AlexaDeviceAddress,
  AlexaDeviceAddressFull,
  AlexaDeviceAddressPostalAndCountry,
} from '../services/AlexaDeviceAddress';

import { AlexaList } from '../services/AlexaList';
import {
  AbsoluteReminder,
  AlexaReminder,
  RelativeReminder,
  ReminderListResponse,
  ReminderResponse,
} from '../services/AlexaReminder';
import { ShoppingList, ShoppingListItem, ToDoList, ToDoListItem } from './Interfaces';
import { AlexaSkill } from './AlexaSkill';
import {
  AmazonPayAPI,
  BuyerIdResponse,
  AmazonPayApiRequestOptions,
  BuyerAddressRequestOptions,
  BuyerAddressResponse,
  BuyerAddress,
} from '../services/AmazonPayAPI';

export class AlexaUser extends User {
  alexaSkill: AlexaSkill;
  alexaList: AlexaList;
  alexaReminder: AlexaReminder;

  constructor(alexaSkill: AlexaSkill) {
    super(alexaSkill);
    this.alexaSkill = alexaSkill;
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    this.alexaList = new AlexaList(alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
    this.alexaReminder = new AlexaReminder(
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
    );
  }

  getAccessToken() {
    return this.alexaSkill.$request!.getAccessToken();
  }

  getId(): string {
    return this.alexaSkill.$request!.getUserId();
  }

  /**
   * Returns a personId associated with a voice profile.
   * @returns {string}
   */
  getPersonId() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;
    return alexaRequest.getPersonId();
  }

  /**
   * Returns alexa shopping list
   * @param {'active'|'completed'} status
   * @return {Promise}
   */
  async getShoppingList(status = 'active'): Promise<ShoppingList> {
    const list = await this.alexaList.getList('Alexa shopping list', status);
    if (!list.items) {
      list.items = [];
    }
    return list as ShoppingList;
  }

  /**
   * Returns alexa to do list
   * @param {'active'|'completed'} status
   * @return {Promise}
   */
  async getToDoList(status = 'active'): Promise<ToDoList> {
    const list = await this.alexaList.getList('Alexa to-do list', status);
    if (!list.items) {
      list.items = [];
    }
    return list as ToDoList;
  }

  /**
   * Adds item to shopping list
   * @param {string} value
   * @param {'active'|'completed'} status
   * @return {Promise}
   */
  addToShoppingList(value: string, status = 'active'): Promise<ToDoListItem> {
    return this.alexaList.addToList('Alexa shopping list', value, status);
  }
  //
  /**
   * Adds item to to do list
   * @param {string} value
   * @param {'active'|'completed'} status
   * @return {Promise}
   */
  addToToDoList(value: string, status = 'active'): Promise<ToDoListItem> {
    return this.alexaList.addToList('Alexa to-do list', value, status);
  }

  /**
   * Updates item in to do list
   * @param {string} oldValue
   * @param {string} newValue
   * @param {'active'|'completed'} newStatus
   * @return {*}
   */
  updateToDoList(
    oldValue: string,
    newValue: string,
    newStatus = 'active',
  ): Promise<ShoppingListItem> {
    return this.alexaList.updateList('Alexa to-do list', oldValue, newValue, newStatus);
  }

  /**
   * Updates item in to do list
   * @param {string} oldValue
   * @param {string} newValue
   * @param {'active'|'completed'} newStatus
   * @return {*}
   */
  updateToDoListItem(
    oldValue: string,
    newValue: string,
    newStatus = 'active',
  ): Promise<ShoppingListItem> {
    return this.updateToDoList(oldValue, newValue, newStatus);
  }

  /**
   * Updates item in shopping list
   * @param {string} oldValue
   * @param {string} newValue
   * @param {'active'|'completed'} newStatus
   * @return {*}
   */
  updateShoppingList(
    oldValue: string,
    newValue: string,
    newStatus = 'active',
  ): Promise<ShoppingListItem> {
    return this.alexaList.updateList('Alexa shopping list', oldValue, newValue, newStatus);
  }

  /**
   * Updates item in shopping list
   * @param {string} oldValue
   * @param {string} newValue
   * @param {'active'|'completed'} newStatus
   * @return {*}
   */
  updateShoppingListItem(
    oldValue: string,
    newValue: string,
    newStatus = 'active',
  ): Promise<ShoppingListItem> {
    return this.updateShoppingList(oldValue, newValue, newStatus);
  }

  /**
   * Deletes item from shopping list
   * @param {string} value
   * @param {'active'|'completed'} status
   * @return {*}
   */
  deleteShoppingListItem(value: string, status = 'active'): Promise<ShoppingListItem> {
    return this.alexaList.deleteListItem('Alexa shopping list', value, status);
  }

  /**
   * Deletes item from to-do list
   * @param {string} value
   * @param {'active'|'completed'} status
   * @return {*}
   */
  deleteToDoListItem(value: string, status = 'active'): Promise<ToDoListItem> {
    return this.alexaList.deleteListItem('Alexa to-do list', value, status);
  }
  /**
   * Returns full address of user
   * @return {Promise}
   */
  getDeviceAddress(): Promise<AlexaDeviceAddressFull> {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaDeviceAddress.deviceAddressApi(
      AlexaDeviceAddress.ADDRESS,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
      alexaRequest.getDeviceId(),
    );
  }

  /**
   * Returns country and postal code of user
   * @return {Promise}
   */
  getCountryAndPostalCode(): Promise<AlexaDeviceAddressPostalAndCountry> {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaDeviceAddress.deviceAddressApi(
      AlexaDeviceAddress.COUNTRY_AND_POSTAL_CODE,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
      alexaRequest.getDeviceId(),
    );
  }

  /**
   * Returns name of user, if granted
   * @return {Promise}
   */
  getName() {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;

    return AlexaContact.contactAPI(
      AlexaContact.NAME,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
    );
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
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaContact.contactAPI(
      AlexaContact.EMAIL,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
    );
  }
  /**
   * Returns given name of user, if granted
   * @return {Promise}
   */
  getGivenName() {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaContact.contactAPI(
      AlexaContact.GIVEN_NAME,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
    );
  }

  /**
   * Returns mobile number user, if granted
   * @return {Promise}
   */
  getMobileNumber() {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaContact.contactAPI(
      AlexaContact.MOBILE_NUMBER,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
    );
  }

  /**
   * Returns users' timezone
   * @return {Promise}
   */
  getTimezone(): Promise<string> {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaSettings.settingsAPI(
      AlexaSettings.TIMEZONE,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
      alexaRequest.getDeviceId(),
    );
  }

  /**
   * Returns users' distance measurement unit
   * @return {Promise}
   */
  getDistanceUnit() {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaSettings.settingsAPI(
      AlexaSettings.DISTANCE_UNITS,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
      alexaRequest.getDeviceId(),
    );
  }

  /**
   * Returns users' temperature measurement unit
   * @return {Promise}
   */
  getTemperatureUnit() {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    return AlexaSettings.settingsAPI(
      AlexaSettings.TEMPERATURE_UNITS,
      alexaRequest.getApiEndpoint(),
      alexaRequest.getApiAccessToken(),
      alexaRequest.getDeviceId(),
    );
  }

  /**
   * Sets reminder
   * @param {*} reminder
   * @return {Promise<any>}
   */
  setReminder(reminder: AbsoluteReminder | RelativeReminder): Promise<ReminderResponse> {
    return this.alexaReminder.setReminder(reminder);
  }

  /**
   * Gets reminder
   * @param {string} alertToken
   * @return {Promise<any>}
   */
  getReminder(alertToken: string): Promise<ReminderListResponse> {
    return this.alexaReminder.getReminder(alertToken);
  }

  /**
   * Updates reminder
   * @param {string} alertToken
   * @param {*} reminder
   * @return {Promise<any>}
   */
  updateReminder(alertToken: string, reminder: AbsoluteReminder | RelativeReminder) {
    return this.alexaReminder.updateReminder(alertToken, reminder);
  }

  /**
   * Deletes reminder
   * @param {string} alertToken
   * @return {Promise<void>}
   */
  deleteReminder(alertToken: string) {
    return this.alexaReminder.deleteReminder(alertToken);
  }

  /**
   * Retrieves all reminders
   * @return {Promise<data>}
   */
  getAllReminders(): Promise<ReminderListResponse> {
    return this.alexaReminder.getAllReminders();
  }

  getBuyerId(options?: AmazonPayApiRequestOptions): Promise<BuyerIdResponse> {
    if (!options) {
      options = {};
    }
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    if (!options.apiAccessToken) {
      options.apiAccessToken = alexaRequest.getApiAccessToken();
    }

    if (!options.host) {
      options.host = AmazonPayAPI.mapAlexaApiEndpointToAmazonPayApiHost(
        alexaRequest.getApiEndpoint(),
      );
    }

    return AmazonPayAPI.getBuyerId(options);
  }

  getBuyerAddress(options: BuyerAddressRequestOptions): Promise<BuyerAddressResponse> {
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    if (!options.apiAccessToken) {
      options.apiAccessToken = alexaRequest.getApiAccessToken();
    }

    if (!options.host) {
      options.host = AmazonPayAPI.mapAlexaApiEndpointToAmazonPayApiHost(
        alexaRequest.getApiEndpoint(),
      );
    }

    return AmazonPayAPI.getBuyerAddress(options);
  }

  async getDefaultBuyerAddress(
    options: BuyerAddressRequestOptions,
  ): Promise<BuyerAddress | undefined> {
    const { addresses } = await this.getBuyerAddress(options);
    const defaultAddress = addresses.find((address) => {
      return address.addressType === 'DefaultOneClickShippingAddress';
    });

    return defaultAddress;
  }
}
