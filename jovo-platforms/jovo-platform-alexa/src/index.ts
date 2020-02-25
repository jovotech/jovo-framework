import { LinkAccountCard } from './response/visuals/LinkAccountCard';
import { Directive, DynamicEntityType } from './core/AlexaResponse';
import { Config } from './Alexa';

export { AlexaRequestBuilder } from './core/AlexaRequestBuilder';
export { Alexa, Config } from './Alexa';
export { AlexaSkill } from './core/AlexaSkill';
export { AlexaTestSuite } from './core/Interfaces';
export * from './core/AlexaRequest';
export * from './modules/AmazonPay';
export * from './services/AlexaReminder';
export * from './services/AmazonPayAPI';

export { AlexaResponse } from './core/AlexaResponse';

export * from './services/AlexaAPI';

export { AudioPlayer } from './modules/AudioPlayerPlugin';
export { BodyTemplate1 } from './response/visuals/BodyTemplate1';
export { BodyTemplate2 } from './response/visuals/BodyTemplate2';
export { BodyTemplate3 } from './response/visuals/BodyTemplate3';
export { BodyTemplate6 } from './response/visuals/BodyTemplate6';
export { BodyTemplate7 } from './response/visuals/BodyTemplate7';
export { ListTemplate1 } from './response/visuals/ListTemplate1';
export { ListTemplate2 } from './response/visuals/ListTemplate2';
export { ListTemplate3 } from './response/visuals/ListTemplate3';
export { Apl } from './modules/AplPlugin';

export {
  ProactiveEventObject,
  WeatherAlertActivatedEvent,
  SportsEventUpdatedEvent,
  MessageAlertActivatedEvent,
  OrderStatusUpdatedEvent,
  OccasionUpdatedEvent,
  TrashCollectionAlertActivatedEvent,
  MediaContentAvailableEvent,
  SocialGameInviteAvailableEvent,
} from './modules/ProactiveEvent';

export { SimpleCard } from './response/visuals/SimpleCard';
export { StandardCard } from './response/visuals/StandardCard';
export { LinkAccountCard } from './response/visuals/LinkAccountCard';
export { AskForContactPermissionsCard } from './response/visuals/AskForContactPermissionsCard';
export { AskForListPermissionsCard } from './response/visuals/AskForListPermissionsCard';
export { AskForLocationPermissionsCard } from './response/visuals/AskForLocationPermissionsCard';
export { AskForPermissionsConsentCard } from './response/visuals/AskForPermissionsConsentCard';
export { AskForRemindersPermissionsCard } from './response/visuals/AskForRemindersPermissionsCard';

export { AlexaSpeechBuilder } from './core/AlexaSpeechBuilder';

import { AlexaSkill } from './core/AlexaSkill';

import { AudioPlayer } from './modules/AudioPlayerPlugin';
import { Card } from './response/visuals/Card';
import { Dialog } from './modules/DialogInterface';
import { GadgetController } from './modules/GadgetControllerPlugin';
import { GameEngine } from './modules/GameEnginePlugin';
import { InSkillPurchase } from './modules/InSkillPurchasePlugin';
import { Template } from './response/visuals/Template';

import { Handler } from 'jovo-core';
import { Intent } from './core/AlexaRequest';
import { AlexaSpeechBuilder } from './core/AlexaSpeechBuilder';
import { ProactiveEvent } from './modules/ProactiveEvent';

import { Apl } from './modules/AplPlugin';
import { EmotionName, EmotionIntensity } from './core/Interfaces';
import { AmazonPay } from './modules/AmazonPay';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $alexaSkill?: AlexaSkill;
    alexaSkill(): AlexaSkill;
    isAlexaSkill(): boolean;
  }
}

declare module 'jovo-core/dist/src/core/BaseApp' {
  interface BaseApp {
    /**
     * Sets alexa handlers
     * @public
     * @param {*} handler
     */
    setAlexaHandler(...handler: Handler[]): this; // tslint:disable-line
  }
}

declare module 'jovo-core/dist/src/util/SpeechBuilder' {
  interface SpeechBuilder {
    addLangText(
      language: string,
      text: string | string[],
      condition?: boolean,
      probability?: number,
    ): this;
    addTextWithPolly(
      pollyName: string,
      text: string | string[],
      condition?: boolean,
      probability?: number,
    ): this;
    addEmotion(
      name: EmotionName,
      intensity: EmotionIntensity,
      text: string | string[],
      condition?: boolean,
      probability?: number,
      surroundSsml?: SsmlElements,
    ): this;
  }
}

// CanFulFill
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    /**
     * Sets negative can fulfill request values.
     * @public
     */
    cannotFulfillRequest(): this;

    /**
     * Sets possible can fulfill request values.
     * @public
     */
    mayFulfillRequest(): this;

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} canFulfillRequest
     */
    canFulfillRequest(canFulfillRequest?: string): this;

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} slotName
     * @param {string} canUnderstandSlot
     * @param {string} canFulfillSlot
     */
    canFulfillSlot(slotName: string, canUnderstandSlot: string, canFulfillSlot: string): this;
  }
}

// AudioPlayer
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $audioPlayer?: AudioPlayer;
    audioPlayer(): AudioPlayer | undefined;
  }
}

// Apl
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $apl?: Apl;
  }
}

declare module './core/AlexaSkill' {
  interface AlexaSkill {
    /**
     * Implementation of standard card
     * Show a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} text
     * @param {*} image object with secured image url
     * @return {AlexaSkill} this
     */
    showStandardCard(
      title: string,
      text: string,
      image: { smallImageUrl: string; largeImageUrl: string },
    ): this;

    /**
     * Shows ask for country and postal code card
     * @public
     * @return {AlexaSkill}
     */
    showAskForCountryAndPostalCodeCard(): this;

    /**
     * Shows ask for address card
     * @public
     * @return {AlexaSkill}
     */
    showAskForAddressCard(): this;

    /**
     * Shows ask for geolocation card
     * @public
     * @return {AlexaSkill}
     */
    showAskForGeoLocationCard(): this;

    /**
     * Shows ask for amazon pay permission card
     * @public
     * @return {AlexaSkill}
     */
    showAskForAmazonPayPermissionCard(): this;

    /**
     * Shows ask for list permission card
     * @public
     * @param {Array} types 'write' or 'read'
     * @return {Jovo}
     */
    showAskForListPermissionCard(types: string[]): this;

    /**
     * Shows ask for list permission card
     * @public
     * @param {Array} contactProperties name|given_name|email|mobile_number
     * @return {Jovo}
     */
    showAskForContactPermissionCard(contactProperties: string[]): this;

    /**
     * Shows ask for reminders permission card
     * @public
     * @return {Jovo}
     */
    showAskForRemindersPermissionCard(): this;

    /**
     * Adds card to response object
     * @public
     * @param {Card} card
     */
    showCard(card: Card): this;
  }
}

// Dialog
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $dialog?: Dialog;
    dialog(): Dialog | undefined;

    /**
     * Clears temporary dynamic entities
     */
    clearDynamicEntities(): this;

    /**
     * Replaces dynamic entities for the session
     * @param dynamicEntityTypes
     */
    replaceDynamicEntities(dynamicEntityTypes: DynamicEntityType[]): this;

    addDynamicEntityTypes(dynamicEntityTypes: DynamicEntityType[]): this;
    addDynamicEntityType(dynamicEntityType: DynamicEntityType): this;
  }
}
// GadgetController
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $gadgetController?: GadgetController;
    gadgetController(): GadgetController | undefined;
  }
}

// GameEngine
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $gameEngine?: GameEngine;
    gameEngine(): GameEngine | undefined;
  }
}
// InSkillPurchase
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $inSkillPurchase?: InSkillPurchase;
    inSkillPurchase(): InSkillPurchase | undefined;
  }
}

// SkillEvent
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    getBody(): object;
    getSkillEventBody(): object;
  }
}

// Display
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    /**
     * Shows template on Echo Show
     * @public
     * @param {*} template
     * @return {AlexaSkill}
     */
    showDisplayTemplate(template: Template): this;

    /**
     * Shows hint on Echo Show
     * @public
     * @param {*} text
     * @return {AlexaSkill}
     */
    showHint(text: string | string[]): this;

    /**
     * Adds apl directive
     * @public
     * @param {*} directive
     * @return {AlexaSkill}
     */
    addAplDirective(directive: any): this; // tslint:disable-line

    /**
     * Adds apl directive
     * @deprecated Please use addAPLDirective()
     * @public
     * @param {*} directive
     * @return {AlexaSkill}
     */
    addAPLDirective(directive: any): this; // tslint:disable-line

    /**
     * Adds apl document
     * @public
     * @param {*} documentDirective
     * @return {AlexaSkill}
     */
    addAPLDocument(documentDirective: any): this; // tslint:disable-line

    /**
     * Adds apl command
     * @public
     * @param {string} token
     * @param {*} commands
     * @return {AlexaSkill}
     */
    addAPLCommands(token: string, commands: any[]): this; // tslint:disable-line

    /**
     * Shows video on Echo Show
     * @public
     * @param {string} url
     * @param {string} title
     * @param {string} subtitle
     */
    showVideo(url: string, title?: string, subtitle?: string): this;
  }
}

// Proactive Event
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $proactiveEvent?: ProactiveEvent;
    proactiveEvent(): ProactiveEvent | undefined;
  }
}

interface AppAlexaConfig {
  Alexa?: Config;
}

// Amazon Pay
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    $pay?: AmazonPay;
    pay(): AmazonPay | undefined;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    Alexa: {
      Directives?: Directive[];
      AskForPermission?: AskForPermissionDirective;
    };
  }

  interface AppPlatformConfig extends AppAlexaConfig {}
  interface ExtensiblePluginConfigs extends AppAlexaConfig {}
}

export interface AskForPermissionDirective {
  type: string;
  name: 'AskFor';
  payload: {
    '@type': 'AskForPermissionsConsentRequest';
    '@version': string;
    'permissionScope': string;
  };
  token?: string;
}

// Ask For
declare module './core/AlexaSkill' {
  interface AlexaSkill {
    askForPermission(permissionScope: string, token?: string): this;
    askForReminders(token?: string): this;
    getPermissionStatus(): string | undefined;
    hasPermissionAccepted(): boolean;
    hasPermissionDenied(): boolean;
  }
}
