import {LinkAccountCard} from "./response/visuals/LinkAccountCard";

export { AlexaRequestBuilder } from "./core/AlexaRequestBuilder";
export { Alexa } from './Alexa';
export { AlexaSkill } from './core/AlexaSkill';
export { AlexaRequest } from './core/AlexaRequest';
export { AlexaResponse } from './core/AlexaResponse';

export { AudioPlayer } from './modules/AudioPlayerPlugin';
export { BodyTemplate1 } from './response/visuals/BodyTemplate1';
export { BodyTemplate2 } from './response/visuals/BodyTemplate2';
export { BodyTemplate3 } from './response/visuals/BodyTemplate3';
export { BodyTemplate6 } from './response/visuals/BodyTemplate6';
export { BodyTemplate7 } from './response/visuals/BodyTemplate7';
export { ListTemplate1 } from './response/visuals/ListTemplate1';
export { ListTemplate2 } from './response/visuals/ListTemplate2';
export { ListTemplate3 } from './response/visuals/ListTemplate3';

export { SimpleCard } from './response/visuals/SimpleCard';
export { StandardCard } from './response/visuals/StandardCard';
export { LinkAccountCard } from './response/visuals/LinkAccountCard';
export { AskForContactPermissionsCard } from './response/visuals/AskForContactPermissionsCard';
export { AskForListPermissionsCard } from './response/visuals/AskForListPermissionsCard';
export { AskForLocationPermissionsCard } from './response/visuals/AskForLocationPermissionsCard';
export { AskForPermissionConsentCard } from './response/visuals/AskForPermissionConsentCard';
import { AlexaSkill } from './core/AlexaSkill';

import {AudioPlayer} from "./modules/AudioPlayerPlugin";
import {Card} from "./response/visuals/Card";
import {Dialog} from "./modules/DialogInterface";
import {GadgetController} from "./modules/GadgetControllerPlugin";
import {GameEngine} from "./modules/GameEnginePlugin";
import {InSkillPurchase} from "./modules/InSkillPurchasePlugin";
import {Template} from "./response/visuals/Template";

import {Handler} from "jovo-core";


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
        canFulfillRequest(canFulfillRequest: string): this;

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
        showHint(text: string): this;


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
