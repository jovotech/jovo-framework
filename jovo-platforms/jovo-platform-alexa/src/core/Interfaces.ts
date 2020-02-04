import { TestSuite } from 'jovo-core';
import { AlexaRequestBuilder } from './AlexaRequestBuilder';
import { AlexaResponseBuilder } from './AlexaResponseBuilder';

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

export enum AlexaDeviceName {
  ALEXA_AUDIO_ONLY = 'AUDIO_ALEXA_AUDIO_ONLY',
  ALEXA_HUB_SMALL_ROUND = 'ALEXA_HUB_SMALL_ROUND',
  ALEXA_HUB_SMALL_RECTANGLE = 'ALEXA_HUB_SMALL_RECTANGLE',
  ALEXA_HUB_MEDIUM_RECTANGLE = 'ALEXA_HUB_MEDIUM_RECTANGLE',
  ALEXA_HUB_LARGE_RECTANGLE = 'ALEXA_HUB_LARGE_RECTANGLE',
  ALEXA_TV_XLARGE_RECTANGLE = 'ALEXA_TV_XLARGE_RECTANGLE',
  ALEXA_UNSPECIFIED = 'ALEXA_UNSPECIFIED',
  ALEXA_UNSPECIFIED_SCREEN = 'ALEXA_UNSPECIFIED_SCREEN',
}

export type EmotionName = 'excited' | 'disappointed';
export type EmotionIntensity = 'low' | 'medium' | 'high';
