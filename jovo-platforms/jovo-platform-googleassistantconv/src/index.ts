import {
  Simple,
  Card,
  Collection,
  List,
  TypeOverride,
  Table,
  Image,
  Media,
  Suggestion,
} from './core/Interfaces';
import { GoogleAction } from './core/GoogleAction';
import { AskOutput, Handler, TellOutput } from 'jovo-core';
import { MediaResponse } from './modules/MediaResponse';
export { GoogleAssistant, Config } from './GoogleAssistant';
export { GoogleAssistantTestSuite, Suggestion } from './core/Interfaces';
import { NextScene } from './core/Interfaces';

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $googleAction?: GoogleAction;

    /**
     * Returns googleAction instance
     * @returns {GoogleAction}
     */
    googleAction(): GoogleAction;

    /**
     * Type of platform is Google Action
     * @public
     * @return {boolean} isGoogleAction
     */
    isGoogleAction(): boolean;
  }
}

declare module 'jovo-core/dist/src/core/BaseApp' {
  /**
   * Sets alexa handlers
   * @public
   * @param {*} handler
   */
  interface BaseApp {
    setGoogleAssistantHandler(...handler: Handler[]): this;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    addFirstSimple(firstSimple: Simple): this;
    addLastSimple(lastSimple: Simple): this;
    addCard(card: Card): this;
    addBasicCard(basicCard: Card): this;
    addImage(image: Image): this;
    addImageCard(imageCard: Image): this;
    addTable(table: Table): this;
    addList(list: List): this;
    addCollection(collection: Collection): this;

    addTypeOverrides(typeOverrides: TypeOverride[]): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    GoogleAssistant: {
      tell?: TellOutput;
      ask?: AskOutput;
      firstSimple?: Simple;
      lastSimple?: Simple;
      card?: Card;
      image?: Image;
      table?: Table;
      list?: List;
      collection?: Collection;
      typeOverrides?: TypeOverride[];
      media?: Media;
      suggestions?: Suggestion[];
      nextScene?: NextScene;
    };
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    $audioPlayer?: MediaResponse;
    $mediaResponse?: MediaResponse;

    audioPlayer(): MediaResponse | undefined;
    mediaResponse(): MediaResponse | undefined;
  }
}
