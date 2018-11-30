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

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $alexaSkill?: AlexaSkill;
        alexaSkill(): AlexaSkill;
        isAlexaSkill(): boolean;
    }
}

declare module 'jovo-core/dist/src/BaseApp' {
    interface BaseApp {
        setAlexaHandler(...handler: any): this; // tslint:disable-line
    }
}

// CanFulFill
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        cannotFulfillRequest(): this;
        mayFulfillRequest(): this;
        canFulfillRequest(canFulfillRequest: string): this;
        canFulfillSlot(slotName: string, canUnderstandSlot: string, canFulfillSlot: string): this;
    }
}


// CanFulFill
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        cannotFulfillRequest(): this;
        mayFulfillRequest(): this;
        canFulfillRequest(canFulfillRequest: string): this;
        canFulfillSlot(slotName: string, canUnderstandSlot: string, canFulfillSlot: string): this;
    }
}


// AudioPlayer
declare module './core/AlexaSkill' {

    interface AlexaSkill {
        $audioPlayer?: AudioPlayer;
        audioPlayer(): AudioPlayer;
    }
}


// AudioPlayer
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        showStandardCard(title: string, text: string, image: {smallImageUrl: string, largeImageUrl: string}): this;
        showAskForCountryAndPostalCodeCard(): this;
        showAskForAddressCard(): this;
        showAskForListPermissionCard(types: string[]): this;
        showAskForContactPermissionCard(contactProperties: string[]): this;
        showCard(card: Card): this;
    }
}

// Dialog
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        $dialog?: Dialog;
        dialog(): Dialog;
    }
}
// GadgetController
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        $gadgetController?: GadgetController;
        gadgetController(): GadgetController;
    }
}

// GameEngine
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        $gameEngine?: GameEngine;
        gameEngine(): GameEngine;
    }
}
// InSkillPurchase
declare module './core/AlexaSkill' {
    interface AlexaSkill {
        $inSkillPurchase?: InSkillPurchase;
        inSkillPurchase(): InSkillPurchase;
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
        showDisplayTemplate(template: Template): this;
        showHint(text: string): this;
        showVideo(url: string, title?: string, subtitle?: string): this;
    }
}
