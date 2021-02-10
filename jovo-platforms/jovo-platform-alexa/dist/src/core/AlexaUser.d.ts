import { User } from 'jovo-core';
import { AlexaDeviceAddressFull, AlexaDeviceAddressPostalAndCountry } from '../services/AlexaDeviceAddress';
import { AlexaList } from '../services/AlexaList';
import { AbsoluteReminder, AlexaReminder, RelativeReminder, ReminderListResponse, ReminderResponse } from '../services/AlexaReminder';
import { ShoppingList, ShoppingListItem, ToDoList, ToDoListItem } from './Interfaces';
import { AlexaSkill } from './AlexaSkill';
import { BuyerIdResponse, AmazonPayApiRequestOptions, BuyerAddressRequestOptions, BuyerAddressResponse, BuyerAddress } from '../services/AmazonPayAPI';
import { AlexaTimer, AnnounceTimer, LaunchTaskTimer, NotifyOnlyTimer, TimerListResponse, TimerResponse } from '../services/AlexaTimer';
export declare class AlexaUser extends User {
    alexaSkill: AlexaSkill;
    alexaList: AlexaList;
    alexaReminder: AlexaReminder;
    alexaTimer: AlexaTimer;
    constructor(alexaSkill: AlexaSkill);
    getAccessToken(): string | undefined;
    getId(): string;
    /**
     * Returns a personId associated with a voice profile.
     * @returns {string}
     */
    getPersonId(): any;
    /**
     * Returns alexa shopping list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    getShoppingList(status?: string): Promise<ShoppingList>;
    /**
     * Returns alexa to do list
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    getToDoList(status?: string): Promise<ToDoList>;
    /**
     * Adds item to shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToShoppingList(value: string, status?: string): Promise<ToDoListItem>;
    /**
     * Adds item to to do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {Promise}
     */
    addToToDoList(value: string, status?: string): Promise<ToDoListItem>;
    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoList(oldValue: string, newValue: string, newStatus?: string): Promise<ShoppingListItem>;
    /**
     * Updates item in to do list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateToDoListItem(oldValue: string, newValue: string, newStatus?: string): Promise<ShoppingListItem>;
    /**
     * Updates item in shopping list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingList(oldValue: string, newValue: string, newStatus?: string): Promise<ShoppingListItem>;
    /**
     * Updates item in shopping list
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateShoppingListItem(oldValue: string, newValue: string, newStatus?: string): Promise<ShoppingListItem>;
    /**
     * Deletes item from shopping list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    deleteShoppingListItem(value: string, status?: string): Promise<ShoppingListItem>;
    /**
     * Deletes item from to-do list
     * @param {string} value
     * @param {'active'|'completed'} status
     * @return {*}
     */
    deleteToDoListItem(value: string, status?: string): Promise<ToDoListItem>;
    /**
     * Returns full address of user
     * @return {Promise}
     */
    getDeviceAddress(): Promise<AlexaDeviceAddressFull>;
    /**
     * Returns country and postal code of user
     * @return {Promise}
     */
    getCountryAndPostalCode(): Promise<AlexaDeviceAddressPostalAndCountry>;
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getName(): Promise<any>;
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getFullName(): Promise<any>;
    /**
     * Returns name of user, if granted
     * @return {Promise}
     */
    getEmail(): Promise<any>;
    /**
     * Returns given name of user, if granted
     * @return {Promise}
     */
    getGivenName(): Promise<any>;
    /**
     * Returns mobile number user, if granted
     * @return {Promise}
     */
    getMobileNumber(): Promise<any>;
    /**
     * Returns users' timezone
     * @return {Promise}
     */
    getTimezone(): Promise<string>;
    /**
     * Returns users' distance measurement unit
     * @return {Promise}
     */
    getDistanceUnit(): Promise<any>;
    /**
     * Returns users' temperature measurement unit
     * @return {Promise}
     */
    getTemperatureUnit(): Promise<any>;
    /**
     * Sets reminder
     * @param {*} reminder
     * @return {Promise<any>}
     */
    setReminder(reminder: AbsoluteReminder | RelativeReminder): Promise<ReminderResponse>;
    /**
     * Gets reminder
     * @param {string} alertToken
     * @return {Promise<any>}
     */
    getReminder(alertToken: string): Promise<ReminderListResponse>;
    /**
     * Updates reminder
     * @param {string} alertToken
     * @param {*} reminder
     * @return {Promise<any>}
     */
    updateReminder(alertToken: string, reminder: AbsoluteReminder | RelativeReminder): Promise<any>;
    /**
     * Deletes reminder
     * @param {string} alertToken
     * @return {Promise<void>}
     */
    deleteReminder(alertToken: string): Promise<any>;
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllReminders(): Promise<ReminderListResponse>;
    /**
     * Sets timer
     * @return {Promise<any>}
     */
    setTimer(timer: NotifyOnlyTimer | AnnounceTimer | LaunchTaskTimer): Promise<TimerResponse>;
    /**
     * Gets specific timer
     * @param {string} id
     * @return {Promise<any>}
     */
    getTimer(id: string): Promise<TimerListResponse>;
    /**
     * Cancel timer
     * @param {string} id
     * @return {Promise<void>}
     */
    cancelTimer(id: string): Promise<any>;
    /**
     * Cancel all timers
     * @return {Promise<void>}
     */
    cancelAllTimers(): Promise<any>;
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    getAllTimers(): Promise<TimerListResponse>;
    getBuyerId(options?: AmazonPayApiRequestOptions): Promise<BuyerIdResponse>;
    getBuyerAddress(options: BuyerAddressRequestOptions): Promise<BuyerAddressResponse>;
    getDefaultBuyerAddress(options: BuyerAddressRequestOptions): Promise<BuyerAddress | undefined>;
}
