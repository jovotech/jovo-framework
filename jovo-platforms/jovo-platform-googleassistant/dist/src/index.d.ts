import { Config } from './GoogleAssistant';
export { GoogleAssistant, Config } from './GoogleAssistant';
export { GoogleAction } from './core/GoogleAction';
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
import { Order } from './core/Interfaces';
import { PaymentParameters, PresentationOptions } from './modules/Transaction';
import { SkuId } from './modules/Transaction';
import { SessionEntityType } from 'jovo-platform-dialogflow';
import { EntityOverrideMode } from 'jovo-platform-dialogflow/dist/src/core/Interfaces';
export { Transaction, RequirementsCheckResult, SupportedCardNetworks, PaymentOptions, OrderOptions, GoogleProvidedOptions, OrderUpdate, } from './modules/Transaction';
declare module 'jovo-core/dist/src/core/Jovo' {
    interface Jovo {
        $googleAction?: GoogleAction;
        googleAction(): GoogleAction;
        isGoogleAction(): boolean;
    }
}
declare module 'jovo-core/dist/src/core/BaseApp' {
    interface BaseApp {
        setGoogleAssistantHandler(...handler: Handler[]): this;
    }
}
declare module './core/GoogleAction' {
    interface GoogleAction {
        askForName(optContext?: string): this;
        askForZipCodeAndCity(optContext?: string): this;
        askForNamePermission(optContext?: string): this;
        askForCoarseLocation(optContext?: string): this;
        askForPreciseLocation(optContext?: string): this;
        askForUpdate(intent: string): this;
        askForNotification(intent: string): this;
        askForPermission(permissions: string[], optContext?: string): this;
        isPermissionGranted(): boolean;
        askForSignIn(optContext?: string): this;
        getSignInStatus(): string;
        isSignInCancelled(): boolean;
        isSignInDenied(): boolean;
        isSignInOk(): boolean;
        askForDateTime(questions: {
            requestDatetimeText: string;
            requestDateText: string;
            requestTimeText: string;
        }): this;
        getDateTime(): string;
        getPlace(): object | undefined;
        askForConfirmation(text: string): this;
        isConfirmed(): boolean;
        askForPlace(requestPrompt: string, permissionContext?: string): this;
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
        showSimpleTable(title: string, subtitle: string, columnHeaders: string[], rowsText: string[][]): this;
        showTable(table: Table): this;
        showList(list: List): this;
        getSelectedElementId(): string;
    }
}
declare module './core/GoogleAction' {
    interface GoogleAction {
        displayText(displayText: string): this;
        richResponse(richResponse: RichResponse): this;
        appendResponse(responseItem: Item): this;
        appendSimpleResponse(simpleResponse: SimpleResponse): this;
        addSessionEntity(name: string, value: string, synonyms: string[], entityOverrideMode?: EntityOverrideMode): this;
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
            data?: Record<string, any>;
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
            AskForDeliveryAddress?: {
                reason: string;
            };
            TransactionDecision?: {
                orderOptions?: OrderOptions;
                paymentOptions: PaymentOptions;
                proposedOrder: any;
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
                data?: Record<string, any>;
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
    interface AppPlatformConfig extends AppGoogleAssistantConfig {
    }
    interface ExtensiblePluginConfigs extends AppGoogleAssistantConfig {
    }
}
