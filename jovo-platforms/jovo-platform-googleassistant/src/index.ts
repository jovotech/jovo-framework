import { Config } from './GoogleAssistant';

export { GoogleAssistant, Config } from './GoogleAssistant';
export { GoogleAssistantTestSuite } from './core/Interfaces';
export { BasicCard } from './response/BasicCard';
export { Carousel } from './response/Carousel';
export { CarouselItem } from './response/CarouselItem';
export { OptionItem } from './response/OptionItem';
export { CarouselBrowseTile } from './response/CarouselBrowseTile';
export { CarouselBrowse } from './response/CarouselBrowse';
export { Table } from './response/Table';
export { List } from './response/List';
export { NotificationObject, NotificationPlugin } from './modules/Notification';
export { GoogleActionSpeechBuilder } from './core/GoogleActionSpeechBuilder';

import { Device } from './modules/AskFor';
import { BasicCard } from './response/BasicCard';
import { Carousel } from './response/Carousel';
import { CarouselBrowse } from './response/CarouselBrowse';
import { Table } from './response/Table';
import { List } from './response/List';
import { MediaResponse } from './modules/MediaResponse';
import { Updates } from './modules/Updates';
import { OrderUpdateV3, RichResponse } from './core/Interfaces';

import { GoogleAction } from './core/GoogleAction';
import { Handler } from 'jovo-core';
import { Transaction, PaymentOptions, OrderUpdate, OrderOptions } from './modules/Transaction';
import { Notification } from './modules/Notification';

export { GoogleActionRequest } from './core/GoogleActionRequest';
export { GoogleActionResponse } from './core/GoogleActionResponse';
export { GoogleAssistantRequestBuilder } from './core/GoogleAssistantRequestBuilder';
export { GoogleAssistantResponseBuilder } from './core/GoogleAssistantResponseBuilder';
import { MediaObject, Item, SimpleResponse } from './core/Interfaces';
import { Order, ReservationUpdate } from './core/Interfaces';
import { PaymentParameters, PresentationOptions } from './modules/Transaction';
import { SkuId } from './modules/Transaction';

import { SessionEntityType } from 'jovo-platform-dialogflow';
import { EntityOverrideMode } from 'jovo-platform-dialogflow/dist/src/core/Interfaces';

export {
  Transaction,
  RequirementsCheckResult,
  SupportedCardNetworks,
  PaymentOptions,
  OrderOptions,
  GoogleProvidedOptions,
  OrderUpdate,
} from './modules/Transaction';
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
    /**
     * Ask for name
     * @public
     * @param {string} optContext
     */
    askForName(optContext?: string): this;

    /**
     * Ask for zipcode and city
     * @public
     * @param {string} optContext
     */
    askForZipCodeAndCity(optContext?: string): this;

    /**
     * Ask for name permission
     * @public
     * @param {string} optContext
     */
    askForNamePermission(optContext?: string): this;

    /**
     * Ask for coarse location permission
     * @public
     * @param {string} optContext
     */
    askForCoarseLocation(optContext?: string): this;

    /**
     * Ask for precise permissions
     * @public
     * @param {string} optContext
     */
    askForPreciseLocation(optContext?: string): this;

    /**
     * Calls askForNotification(intent, name, text)
     *
     * @public
     * @param {string} intent // intent for which you want to send notifications
     */
    askForUpdate(intent: string): this;

    /**
     * Ask for notification permission
     * @public
     * @param {string} intent // intent for which you want to send notifications
     */
    askForNotification(intent: string): this;

    /**
     * Ask for permissions
     * @public
     * @param {'NAME'|'DEVICE_COARSE_LOCATION'|'DEVICE_PRECISE_LOCATION'} permissions
     * @param {string} optContext
     */
    askForPermission(permissions: string[], optContext?: string): this;

    /**
     * Returns true if permission granted
     * @return {boolean}
     */
    isPermissionGranted(): boolean;

    /**
     * Ask form sign in
     * @public
     * @param {string} optContext
     */
    askForSignIn(optContext?: string): this;

    /**
     * Returns sign in status after sign in
     * @public
     * @return {boolean}
     */
    getSignInStatus(): string;

    /**
     * Returns sign in cancelled
     * @public
     * @return {boolean}
     */
    isSignInCancelled(): boolean;

    /**
     * Returns sign in denied
     * @public
     * @return {boolean}
     */
    isSignInDenied(): boolean;

    /**
     * Returns sign in ok
     * @public
     * @return {null|string}
     */
    isSignInOk(): boolean;

    /**
     * Ask for date time
     * @public
     * @param {*} questions
     */
    askForDateTime(questions: {
      requestDatetimeText: string;
      requestDateText: string;
      requestTimeText: string;
    }): this;

    /**
     * Return date time confirmation value
     * @returns {string}
     */
    getDateTime(): string;

    /**
     * Return place confirmation value
     * @return {object}
     */
    getPlace(): object | undefined;

    /**
     * Ask for confirmation
     * @public
     * @param {*} text
     */
    askForConfirmation(text: string): this;

    /**
     * Return confirmation status
     * @returns {boolean}
     */
    isConfirmed(): boolean;

    /**
     *  Ask for place
     * @param {string} requestPrompt
     * @param {string} permissionContext
     * @returns {this}
     */
    askForPlace(requestPrompt: string, permissionContext?: string): this;

    /**
     * Return device object
     * @returns {Device}
     */
    getDevice(): Device;
  }
}
declare module './core/GoogleAction' {
  interface GoogleAction {
    /**
     * Adds basic card to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {BasicCard} basicCard
     * @return {GoogleAction}
     */
    showBasicCard(basicCard: BasicCard): this;

    /**
     * Adds suggestion chips to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Array<String>} chips
     * @return {GoogleAction}
     */
    showSuggestionChips(chips: string[]): this;

    /**
     * Adds link out suggestion chip to response
     * @public
     * @param {string} destinationName
     * @param {string} url
     * @return {GoogleAction}
     */
    showLinkOutSuggestion(destinationName: string, url: string): this;

    /**
     * Adds carousel element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carousel
     * @return {GoogleAction}
     */
    showCarousel(carousel: Carousel): this;

    /**
     * Adds carousel browse element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carouselBrowse
     * @return {GoogleAction}
     */
    showCarouselBrowse(carouselBrowse: CarouselBrowse): this;

    /**
     * Implementation of generic withSimpleTable
     * Shows a simple table card to the response object
     * @public
     * @param {string} title
     * @param {string} subtitle
     * @param {array} columnHeaders
     * @param {array} rowsText
     * @return {GoogleAction} this
     */
    showSimpleTable(
      title: string,
      subtitle: string,
      columnHeaders: string[],
      rowsText: string[][],
    ): this;

    /**
     * Adds table to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Table} table
     * @return {GoogleAction}
     */
    showTable(table: Table): this;

    /**
     * Adds list element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {List} list
     * @return {GoogleAction}
     */
    showList(list: List): this;

    /**
     * Returns token of the request
     * (Touched/Selected Element )
     * @public
     * @return {*}
     */
    getSelectedElementId(): string;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    displayText(displayText: string): this;
    richResponse(richResponse: RichResponse): this;
    appendResponse(responseItem: Item): this;
    appendSimpleResponse(simpleResponse: SimpleResponse): this;

    addSessionEntity(
      name: string,
      value: string,
      synonyms: string[],
      entityOverrideMode?: EntityOverrideMode,
    ): this;
    addSessionEntityTypes(sessionEntityTypes: SessionEntityType[]): this;
    addSessionEntityType(sessionEntityType: SessionEntityType): this;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    $audioPlayer?: MediaResponse;
    $mediaResponse?: MediaResponse;
    $updates?: Updates;

    audioPlayer(): MediaResponse | undefined;
    mediaResponse(): MediaResponse | undefined;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    $transaction?: Transaction;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    htmlResponse(obj: {
      url?: string;
      data?: Record<string, any>; // tslint:disable-line
      suppress?: boolean;
    }): this;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    newSurface(capabilities: string[], context: string, notificationTitle: string): this;
    isNewSurfaceConfirmed(): boolean;
  }
}

declare module './core/GoogleAction' {
  interface GoogleAction {
    $notification?: Notification;
    notification(): Notification | undefined;
  }
}

export interface AppGoogleAssistantConfig {
  GoogleAssistant?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    GoogleAssistant: {
      AskForPermission?: {
        permissions: string[];
        optContext: string;
      };
      AskForUpdatePermission?: {
        intent: string;
        arguments?: object;
      };

      AskForRegisterUpdate?: {
        intent: string;
        frequency: string;
      };

      AskForSignIn?: {
        optContext: string;
      };
      AskForDateTime?: {
        requestDatetimeText: string;
        requestDateText: string;
        requestTimeText: string;
      };
      AskForConfirmation?: string;
      AskForPlace?: {
        requestPrompt: string;
        permissionContext: string;
      };
      card?: {
        BasicCard?: BasicCard;
      };
      SuggestionChips?: string[];
      LinkOutSuggestion?: {
        destinationName: string;
        url: string;
      };
      CarouselBrowse?: CarouselBrowse;
      Carousel?: Carousel;

      Table?: Table;
      List?: List;
      MediaResponse?: MediaObject;

      // transactions
      AskForDeliveryAddress?: {
        reason: string;
      };

      TransactionDecision?: {
        orderOptions?: OrderOptions;
        paymentOptions: PaymentOptions;
        proposedOrder: any; // tslint:disable-line
      };

      TransactionRequirementsCheck?: {};

      TransactionDigitalPurchaseRequirementsCheck?: {};

      TransactionOrder?: {
        order: Order;
        presentationOptions?: PresentationOptions;
        orderOptions?: OrderOptions;
        paymentParameters?: PaymentParameters;
      };

      TransactionOrderUpdate?: {
        orderUpdate: OrderUpdateV3;
      };

      OrderUpdate?: {
        orderUpdate: OrderUpdate;
        speech: string;
      };

      CompletePurchase?: {
        skuId: SkuId;
      };

      HtmlResponse?: {
        url?: string;
        data?: Record<string, any>; // tslint:disable-line
        suppress?: boolean;
      };

      NewSurface?: {
        capabilities: string[];
        context: string;
        notificationTitle: string;
      };

      RichResponse?: RichResponse;
      ResponseAppender?: Item[];

      SessionEntityTypes?: SessionEntityType[];
    };
  }

  export interface AppPlatformConfig extends AppGoogleAssistantConfig {}
  export interface ExtensiblePluginConfigs extends AppGoogleAssistantConfig {}
}
