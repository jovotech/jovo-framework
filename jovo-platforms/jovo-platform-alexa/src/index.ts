import {LinkAccountCard} from "./response/visuals/LinkAccountCard";
import { Directive, DynamicEntityType } from './core/AlexaResponse';

export { AlexaRequestBuilder } from "./core/AlexaRequestBuilder";
export { Alexa } from './Alexa';
export { AlexaSkill } from './core/AlexaSkill';
export { AlexaTestSuite } from './core/Interfaces';
export * from './core/AlexaRequest';
export * from './services/AlexaReminder';

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

export {
    ProactiveEventObject,
    WeatherAlertActivatedEvent,
    SportsEventUpdatedEvent,
    MessageAlertActivatedEvent,
    OrderStatusUpdatedEvent,
    OccasionUpdatedEvent,
    TrashCollectionAlertActivatedEvent,
    MediaContentAvailableEvent,
    SocialGameInviteAvailableEvent
} from './modules/ProactiveEvent';

export { SimpleCard } from './response/visuals/SimpleCard';
export { StandardCard } from './response/visuals/StandardCard';
export { LinkAccountCard } from './response/visuals/LinkAccountCard';
export { AskForContactPermissionsCard } from './response/visuals/AskForContactPermissionsCard';
export { AskForListPermissionsCard } from './response/visuals/AskForListPermissionsCard';
export { AskForLocationPermissionsCard } from './response/visuals/AskForLocationPermissionsCard';
export { AskForPermissionsConsentCard } from './response/visuals/AskForPermissionsConsentCard';
export { AskForRemindersPermissionsCard } from './response/visuals/AskForRemindersPermissionsCard';

export {AlexaSpeechBuilder} from "./core/AlexaSpeechBuilder";

import { AlexaSkill } from './core/AlexaSkill';

import {AudioPlayer} from "./modules/AudioPlayerPlugin";
import {Card} from "./response/visuals/Card";
import {Dialog} from "./modules/DialogInterface";
import {GadgetController} from "./modules/GadgetControllerPlugin";
import {GameEngine} from "./modules/GameEnginePlugin";
import {InSkillPurchase} from "./modules/InSkillPurchasePlugin";
import {Template} from "./response/visuals/Template";

import {Handler} from "jovo-core";
import {Intent} from "./core/AlexaRequest";
import {AlexaSpeechBuilder} from "./core/AlexaSpeechBuilder";
import {ProactiveEvent} from "./modules/ProactiveEvent";

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $alexaSkill?: AlexaSkill;
        alexaSkill(): AlexaSkill;
        isAlexaSkill(): boolean;
    }
}

declare module 'jovo-core/dist/src/BaseApp' {

    interface BaseApp {

        /**
         * Sets alexa handlers
         * @public
         * @param {*} handler
         */
        setAlexaHandler(...handler: Handler[]): this; // tslint:disable-line
    }
}

declare module 'jovo-core/dist/src/SpeechBuilder' {

    interface SpeechBuilder {
        addLangText(language: string, text: string | string[], condition?: boolean, probability?: number): this;
        addTextWithPolly(pollyName: string, text: string | string[], condition?: boolean, probability?: number): this;
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


// AudioPlayer
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
        showStandardCard(title: string, text: string, image: {smallImageUrl: string, largeImageUrl: string}): this;


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

        // deprecated v1 functions

        /**
         * Returns Intent Confirmation status
         * @deprecated Please use this.$alexaSkill.$dialog.getIntentConfirmationStatus();
         * @return {String}
         */
        getIntentConfirmationStatus(): string;


        /**
         * Returns state of dialog
         * @deprecated Please use this.$alexaSkill.$dialog.getState();
         * @return {String}
         */
        getDialogState(): string;


        /**
         * Returns true if dialog is in state COMPLETED
         * @deprecated Please use this.$alexaSkill.$dialog.isCompleted();
         * @return {String}
         */
        isDialogCompleted(): boolean;


        /**
         * Returns true if dialog is in state IN_PROGRESS
         * @deprecated Please use this.$alexaSkill.$dialog.isInProgress();
         * @return {String}
         */
        isDialogInProgress(): boolean;


        /**
         * Returns true if dialog is in state STARTED
         * @deprecated Please use this.$alexaSkill.$dialog.isStarted();
         * @return {String}
         */
        isDialogStarted(): boolean;


        /**
         * Returns if slot is confirmed
         * @deprecated Please use this.$alexaSkill.$dialog.isSlotConfirmed();
         * @return {boolean}
         */
        isSlotConfirmed(slotName: string): boolean;


        /**
         * Returns slot confirmation status
         * @deprecated Please use this.$alexaSkill.$dialog.getSlotConfirmationStatus(slotName);
         * @return {boolean}
         */
        getSlotConfirmationStatus(slotName: string): boolean;


        /**
         * Returns if slot is confirmed
         * @deprecated Please use this.$alexaSkill.$dialog.hasSlotValue(slotName);
         * @return {boolean}
         */
        hasSlotValue(slotName: string): boolean;


        /**
         * Creates delegate directive. Alexa handles next dialog
         * step
         * @deprecated Please use this.$alexaSkill.$dialog.delegate(updatedIntent);
         * @param {Intent} updatedIntent
         * @return {AlexaResponse}
         */
        dialogDelegate(updatedIntent?: Intent): AlexaSkill;


        /**
         * Let alexa ask user for the value of a specific slot
         * @deprecated Please use this.$alexaSkill.$dialog.elicitSlot(slotToElicit, speech, reprompt, updatedIntent);
         * @param {string} slotToElicit name of the slot
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        dialogElicitSlot(slotToElicit: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;


        /**
         * Let alexa ask user to confirm slot with yes or no
         * @public
         * @param {string} slotToConfirm name of the slot
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        dialogConfirmSlot(slotToConfirm: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;


        /**
         * Asks for intent confirmation
         * @deprecated Please use this.$alexaSkill.$dialog.confirmIntent(speech, reprompt, updatedIntent);
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        dialogConfirmIntent(speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;


        /**
         * Clears temporary dynamic entities
         */
        clearDynamicEntities(): this;


        /**
         * Replaces dynamic entities for the session
         * @param dynamicEntityTypes
         */
        replaceDynamicEntities(dynamicEntityTypes: DynamicEntityType[]): this;

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


declare module 'jovo-core/dist/src/Interfaces' {

    interface Output {
        Alexa: {
            Directives?: Directive[];

        };
    }
}
