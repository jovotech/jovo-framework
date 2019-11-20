import { JovoResponse, SessionConstants, SessionData } from 'jovo-core';
import { Button, CardContent } from '../response';
import { Message, MessageContentObject } from './Interfaces';
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface SessionAttributes {
  [key: string]: any; //tslint:disable-line
}

export interface SapCaiResponseJSON {
  replies?: Message[];
  conversation?: ConversationData;
}

export interface ConversationData {
  memory?: SessionAttributes;
}

export class SapCaiResponse implements JovoResponse {
  replies: Message[];
  conversation?: ConversationData;

  constructor() {
    this.replies = [];
    this.conversation = { memory: {} };
  }

  // of the User to an instance of the class
  static fromJSON(json: SapCaiResponseJSON | string) {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, SapCaiResponse.reviver);
    } else {
      // create an instance of the User class
      const response = Object.create(SapCaiResponse.prototype);
      // copy all the fields from the json object
      return Object.assign(response, json);
    }
  }

  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? SapCaiResponse.fromJSON(value) : value;
  }

  getFirstReply(type: string): Message | undefined {
    return this.replies.find((item: Message) => {
      return item.type === type;
    });
  }

  getBasicText(): Message | undefined {
    return this.getFirstReply('text');
  }

  getBasicCard(): Message | undefined {
    return this.getFirstReply('card');
  }

  getQuickReplyCard(): Message | undefined {
    return this.getFirstReply('quickReplies');
  }

  hasQuickReplyCard(title: string, ...chips: string[]): boolean {
    const quickReplyCard = this.getQuickReplyCard();
    if (
      !title ||
      !quickReplyCard ||
      typeof quickReplyCard.content !== 'object' ||
      Array.isArray(quickReplyCard.content) ||
      !quickReplyCard.content.title ||
      !quickReplyCard.content.buttons ||
      !Array.isArray(quickReplyCard.content.buttons) ||
      quickReplyCard.content.title !== title
    ) {
      return false;
    }

    return this.hasAllChipsAsButtons(quickReplyCard.content as MessageContentObject, chips);
  }

  getButtonsCard() {
    return this.getFirstReply('buttons');
  }

  hasButtonsCard(title: string, ...chips: string[]) {
    const buttonList = this.getButtonsCard();

    if (
      !title ||
      !buttonList ||
      typeof buttonList.content !== 'object' ||
      Array.isArray(buttonList.content) ||
      !buttonList.content.title ||
      !buttonList.content.buttons ||
      !Array.isArray(buttonList.content.buttons) ||
      buttonList.content.title !== title
    ) {
      return false;
    }

    return this.hasAllChipsAsButtons(buttonList.content as MessageContentObject, chips);
  }

  getCarouselCard() {
    return this.getFirstReply('carousel');
  }

  hasCarouselCard(...items: CardContent[]) {
    const carousel = this.getCarouselCard();

    if (!carousel || typeof carousel.content !== 'object' || !Array.isArray(carousel.content)) {
      return false;
    }

    const hasInvalidItems = items.some((item: CardContent, index: number) => {
      const content: MessageContentObject[] = carousel.content as MessageContentObject[];

      const hasInvalidButtons = item.buttons
        ? item.buttons.some((button: Button, i: number) => {
            return !content[index].buttons || button.title !== content[index].buttons![i].title;
          })
        : false;
      return (
        !content[index] ||
        item.title !== content[index].title ||
        item.subtitle !== content[index].subtitle ||
        item.imageUrl !== content[index].imageUrl ||
        hasInvalidButtons
      );
    });

    return !hasInvalidItems;
  }

  getListCard() {
    return this.getFirstReply('list');
  }

  hasListCard(elements: CardContent[], buttonChips: string[]) {
    const list = this.getListCard();

    if (!list || typeof list.content !== 'object') {
      return false;
    }

    const hasInvalidElement = elements.some((element: CardContent, index: number) => {
      const content: MessageContentObject = list.content as MessageContentObject;

      const hasInvalidButtons = element.buttons
        ? element.buttons.some((button: Button, i: number) => {
            return (
              !content.elements![index].buttons ||
              button.title !== content.elements![index].buttons![i].title
            );
          })
        : false;
      return (
        (content.elements && !content.elements[index]) ||
        element.title !== content.elements![index].title ||
        element.subtitle !== content.elements![index].subtitle ||
        element.imageUrl !== content.elements![index].imageUrl ||
        hasInvalidButtons
      );
    });

    if (buttonChips) {
      const validChips = this.hasAllChipsAsButtons(
        list.content as MessageContentObject,
        buttonChips,
      );
      if (!validChips) {
        return false;
      }
    }

    return !hasInvalidElement;
  }

  getImageCard() {
    return this.getFirstReply('picture');
  }

  hasImageCard(pictureUrl: string) {
    const card = this.getImageCard();

    if (!card) {
      return false;
    }

    if (!pictureUrl || !card.content || card.content !== pictureUrl) {
      return false;
    }

    return true;
  }

  hasStandardCard(title?: string, subtitle?: string, imageUrl?: string): boolean {
    const basicCardObject = this.getBasicCard();

    if (!basicCardObject || typeof basicCardObject.content !== 'object') {
      return false;
    }

    const content: MessageContentObject = basicCardObject.content as MessageContentObject;
    const hasInvalidData =
      (title && title !== content.title) ||
      (subtitle && subtitle !== content.subtitle) ||
      (imageUrl && imageUrl !== content.imageUrl);
    return !hasInvalidData;
  }

  getSessionData(path?: string) {
    if (path) {
      return this.getSessionAttribute(path);
    } else {
      return this.getSessionAttributes();
    }
  }

  // tslint:disable-next-line:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  setSessionData(sessionData: SessionData) {
    return this.setSessionAttributes(sessionData);
  }

  getSessionAttributes() {
    return _get(this, 'conversation.memory');
  }

  setSessionAttributes(sessionData: SessionData) {
    _set(this, 'conversation.memory', sessionData);
    return this;
  }

  getSpeech() {
    return undefined;
  }

  getReprompt() {
    return undefined;
  }

  getSpeechPlain() {
    return undefined;
  }

  getRepromptPlain() {
    return undefined;
  }

  getSessionAttribute(name: string) {
    return _get(this, `conversation.memory.${name}`);
  }

  // tslint:disable-next-line:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    if (!this.getSessionAttribute(name)) {
      return false;
    }

    if (typeof value !== 'undefined') {
      if (this.getSessionAttribute(name) !== value) {
        return false;
      }
    }

    return true;
  }

  hasState(state: string): boolean {
    return this.hasSessionAttribute(SessionConstants.STATE, state);
  }

  hasSessionEnded() {
    return true;
  }

  /**
   * Checks if response is a tell request
   * @param {string| string[]} speechText
   * @return {boolean}
   */
  isTell(speechText?: string | string[]): boolean {
    if (speechText) {
      const basicText = this.getBasicText();
      const ssml = basicText ? basicText.content : '';

      if (Array.isArray(speechText)) {
        for (const speechTextElement of speechText) {
          if (speechTextElement === ssml) {
            return true;
          }
        }
        return false;
      } else {
        return ssml === speechText;
      }
    }
    return true;
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    return false;
  }

  // fromJSON is used to convert an serialized version

  toJSON(): SapCaiResponseJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.

  private hasAllChipsAsButtons(content: MessageContentObject, chips: string[]): boolean {
    return !chips.some((chip: string, index: number) => {
      return !content.buttons![index] || chip !== content.buttons![index].title;
    });
  }
}
