import { Simple, Card, Collection, List, TypeOverride, Table, Image, Media, Suggestion, HtmlResponse, Expected, Order, PresentationOptions, OrderOptions, PaymentParameters, CollectionBrowse, OrderUpdate, SkuId } from './core/Interfaces';
import { GoogleAction } from './core/GoogleAction';
import { Handler } from 'jovo-core';
import { MediaResponse } from './modules/MediaResponse';
export { GoogleAssistant, Config } from './GoogleAssistant';
export { GoogleAssistantTestSuite, Suggestion, Expected } from './core/Interfaces';
import { NextScene } from './core/Interfaces';
import { Prompt } from './core/Interfaces';
import { Transaction } from './modules/Transaction';
export * from './core/Interfaces';
export * from './services/PushNotificationsApi';
export * from './visuals/BasicCard';
export { GoogleAction } from './core/GoogleAction';
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
        addFirstSimple(firstSimple: Simple): this;
        addLastSimple(lastSimple: Simple): this;
        addCard(card: Card): this;
        addBasicCard(basicCard: Card): this;
        addImage(image: Image): this;
        addImageCard(imageCard: Image): this;
        addTable(table: Table): this;
        addList(list: List): this;
        addCollection(collection: Collection): this;
        addCollectionBrowse(collectionBrowse: CollectionBrowse): this;
        addTypeOverrides(typeOverrides: TypeOverride[]): this;
        setTypeOverrides(typeOverrides: TypeOverride[]): this;
        showBasicCard(basicCard: Card): this;
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
            collectionBrowse?: CollectionBrowse;
            typeOverrides?: TypeOverride[];
            media?: Media;
            suggestions?: Suggestion[];
            nextScene?: NextScene;
            prompt?: Prompt;
            htmlResponse?: HtmlResponse;
            askPrompt?: {
                prompt: Prompt;
                reprompts?: Prompt[];
            };
            expected?: Expected;
            TransactionRequirementsCheck?: {};
            TransactionOrder?: {
                order: Order;
                presentationOptions?: PresentationOptions;
                orderOptions?: OrderOptions;
                paymentParameters?: PaymentParameters;
            };
            TransactionOrderUpdate?: {
                orderUpdate: OrderUpdate;
            };
            TransactionDigitalPurchaseRequirementsCheck?: {};
            AskForDeliveryAddress?: {
                reason: string;
            };
            CompletePurchase?: {
                skuId: SkuId;
            };
        };
    }
}
declare module './core/GoogleAction' {
    interface GoogleAction {
        htmlResponse(obj: HtmlResponse): this;
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
declare module './core/GoogleAction' {
    interface GoogleAction {
        $transaction?: Transaction;
    }
}
