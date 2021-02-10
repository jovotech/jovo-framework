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
export declare class AlexaList {
    apiEndpoint: string;
    apiAccessToken: string;
    static ADDRESS: string;
    static COUNTRY_AND_POSTAL_CODE: string;
    constructor(apiEndpoint: string, apiAccessToken: string);
    /**
     * Returns list by name and status
     * @param {string} name
     * @param {'active'|'completed'} listState
     * @return {Promise}
     */
    getList(name: string, listState?: string): Promise<HouseholdList>;
    /**
     * Adds item to list
     * @param {string} listName
     * @param {string} value
     * @param {string} status
     * @return {Promise}
     */
    addToList(listName: string, value: string, status?: string): Promise<any>;
    /**
     * Updates item in list by old value (be careful with items with same name)
     * Use updateListItem to update by ids
     * @param {'Alexa shopping list'|'Alexa to-do list'} listName
     * @param {string} oldValue
     * @param {string} newValue
     * @param {'active'|'completed'} newStatus
     * @return {*}
     */
    updateList(listName: string, oldValue: string, newValue: string, newStatus: string): Promise<any>;
    deleteListItem(listName: string, value: string, listState?: string): Promise<any>;
    /**
     * Return all household lists
     * @return {*}
     */
    getHouseHoldLists(): Promise<HouseholdLists>;
    deleteListItemAPI(listId: string, itemId: string): Promise<any>;
    getListAPI<V = any>(path?: string): Promise<V>;
    createListItemAPI(listId: string, householdListItem: HouseholdListItem): Promise<any>;
    updateListItemAPI(listId: string, householdListItem: HouseholdListItem): Promise<any>;
    private handleApiCall;
}
