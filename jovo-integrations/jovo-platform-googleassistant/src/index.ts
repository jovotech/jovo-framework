export { GoogleAssistant } from './GoogleAssistant';
export { BasicCard } from './response/BasicCard';
export { Carousel } from './response/Carousel';
export { CarouselItem } from './response/CarouselItem';
export { OptionItem } from './response/OptionItem';
export { CarouselBrowseTile } from './response/CarouselBrowseTile';
export { CarouselBrowse } from './response/CarouselBrowse';
export { Table } from './response/Table';
export { List } from './response/List';
import {Device} from "./modules/AskFor";
import {BasicCard} from "./response/BasicCard";
import {Carousel} from "./response/Carousel";
import {CarouselBrowse} from "./response/CarouselBrowse";
import {Table} from "./response/Table";
import {List} from "./response/List";
import {MediaObject, MediaResponse} from "./modules/MediaResponse";

import {GoogleAction} from "./core/GoogleAction";

declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $googleAction?: GoogleAction;
        googleAction(): GoogleAction;
        isGoogleAction(): boolean;
    }
}

declare module 'jovo-core/dist/src/BaseApp' {
    interface BaseApp {
        setGoogleAssistantHandler(...handler: any): this; // tslint:disable-line
    }
}


declare module './core/GoogleAction' {

    interface GoogleAction {
        askForName(optContext: string): this;
        askForZipCodeAndCity(optContext: string): this;
        askForNamePermission(optContext: string): this;
        askForCoarseLocation(optContext: string): this;
        askForPreciseLocation(optContext: string): this;
        askForUpdate(optContext: string): this;
        askForPermission(permissions: string[], optContext: string): this;
        isPermissionGranted(): boolean;
        askForSignIn(optContext: string): this;
        getSignInStatus(): string;
        isSignInCancelled(): boolean;
        isSignInDenied(): boolean;
        isSignInOk(): boolean;
        askForDateTime(questions: {
            requestDatetimeText: string;
            requestDateText: string
            requestTimeText: string
        }): this;
        getDateTime(): string;
        askForConfirmation(text: string): this;
        isConfirmed(): boolean;
        askForPlace(requestPrompt: string, permissionContext: string): this;
        getDevice(): Device;
    }
}
declare module './core/GoogleAction' {
    interface GoogleAction {
        showBasicCard(basicCard: BasicCard): this;
        showSuggestionChips(chips: string[]): this;
        showLinkOutSuggestion(destinationName: string, url: string): this;
        showCarousel(carousel: Carousel): this;
        showCarouselBrowse(carouselBrowse: CarouselBrowse): this;
        showCarouselBrowse(carouselBrowse: CarouselBrowse): this;
        showSimpleTable(title: string, subtitle: string, columnHeaders: any[], rowsText: any[]): this; // tslint:disable-line
        showTable(table: Table): this;
        showList(list: List): this;
        getSelectedElementId(): string;
    }
}

declare module './core/GoogleAction' {
    interface GoogleAction {
        displayText(displayText: string): this;
    }
}


declare module './core/GoogleAction' {
    interface GoogleAction {
        $audioPlayer?: MediaResponse;
        $mediaResponse?: MediaResponse;

        audioPlayer(): MediaResponse;
        mediaResponse(): MediaResponse;
    }
}


declare module 'jovo-core/dist/src/Interfaces' {
    interface Output {
        GoogleAssistant: {
            AskForPermission?: {
                permissions: string[],
                optContext: string
            };
            AskForUpdatePermission?: {
                intent: string,
                optContext: string
            };
            AskForSignIn?: {
                optContext: string;
            };
            AskForDateTime?: {
                requestDatetimeText: string;
                requestDateText: string
                requestTimeText: string
            }
            AskForConfirmation?: string;
            AskForPlace?: {
                requestPrompt: string;
                permissionContext: string;

            }
            card?: {
                BasicCard?: BasicCard;
            }
            SuggestionChips?: string[];
            LinkOutSuggestion?: {
                destinationName: string,
                url: string,
            }
            CarouselBrowse?: CarouselBrowse;
            Table?: Table;
            List?: List;
            MediaResponse?: MediaObject;

        };
    }
}
