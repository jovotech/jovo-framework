export { SAPCAI } from './SAPCAI';
export { SAPCAISkill } from './SAPCAISkill';
export * from './SAPCAIRequest';

export { SAPCAIResponse } from './SAPCAIResponse';

import { Button } from "./response/Button";
export { QuickReply } from './response/QuickReply';
export { Card } from './response/Card';

export {SAPCAISpeechBuilder} from "./SAPCAISpeechBuilder";

import { SAPCAISkill } from './SAPCAISkill';

import {Handler} from "jovo-core";
import {Intent} from "./SAPCAIRequest";
import {SAPCAISpeechBuilder} from "./SAPCAISpeechBuilder";
import { CardContent } from './response/Card';

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $sapcaiSkill?: SAPCAISkill;
        sapcaiSkill(): SAPCAISkill;
        isSAPCAISkill(): boolean;
    }
}

declare module 'jovo-core/dist/src/BaseApp' {

    interface BaseApp {

        /**
         * Sets alexa handlers
         * @public
         * @param {*} handler
         */
        setSAPCAIHandler(...handler: Handler[]): this; // tslint:disable-line
    }
}


// AudioPlayer
declare module './SAPCAISkill' {
    interface SAPCAISkill {

        showStandardCard(title: string, subtitle: string, imageUrl: string, buttons: Button[]): this;

        showQuickReplyCard(title: string, buttons: Button[]): this;

        showButtonsCard(title: string, buttons: Button[]): this;

        showCarouselCard(items: CardContent[]): this;

        showListCard(elements: CardContent[], buttons: Button[]): this;

        showPictureCard(pictureUrl: string): this;

        // Not supported at the moment
        //showVideo(videoUrl: string): this;
        
    }
}

