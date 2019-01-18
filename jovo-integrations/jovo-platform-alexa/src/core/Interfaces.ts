import { TestSuite } from "jovo-core";
import { AlexaRequestBuilder } from "./AlexaRequestBuilder";
import { AlexaResponseBuilder } from "./AlexaResponseBuilder";

export interface AlexaTestSuite extends TestSuite<AlexaRequestBuilder, AlexaResponseBuilder> {}

export interface HouseholdList {
    items: HouseholdListItem[];
    links?: string;
    listId: string;
    name: string;
    state: string;
    version: number;
}
export interface HouseholdListItem {
    createdTime: string;
    href: string;
    id: string;
    status: string;
    updatedTime: string;
    value: string;
    version: number;
}

export interface ShoppingList extends HouseholdList {}
export interface ShoppingListItem extends HouseholdListItem {}

export interface ToDoList extends HouseholdList {}
export interface ToDoListItem extends HouseholdListItem {}
