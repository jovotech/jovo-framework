// import {
//     BaseApp,
//     JovoRequest,
//     RequestType,
//     Plugin,
//     Jovo,
//     Platform,
//     TestSuite,
//     SpeechBuilder,
//     Extensible,
//     JovoResponse
// } from "jovo-core";
// import {AudioPlayer} from "../modules/AudioPlayerPlugin";
// import {Image, ImageShort, PlainText, RichText, TextContent} from "../response/visuals/Template";
// import {AlexaRequestJSON, Intent} from "../core/AlexaRequest";
// import {Response} from "../core/AlexaResponse";
// import {ListItem} from "../response/visuals/ListTemplate1";
//
//
// declare class AlexaSkill extends Jovo {
//     showStandardCard(title: string, content: string, image: { smallImageUrl: string, largeImageUrl: string }): this;
//     showAskForCountryAndPostalCodeCard(): this;
//     showAskForAddressCard(): this;
//     showAskForListPermissionCard(types: string[]): this;
//     showAskForContactPermissionCard(contactProperties: string[]): this;
//     showCard(card: Card): this;
//     showVideo(url: string, title: string, subtitle: string): this;
//
//     audioPlayer(): AudioPlayer;
//     dialog(): Dialog;
//
//     showDisplayTemplate(template: Template): this;
//     showHint(text: string): this;
//
//     progressiveResponse(speech: string | SpeechBuilder, callback?: Function): void | Promise<any>;
// }
//
// declare class Template {
//     type: string;
//     title: string;
//     token: string;
//     backButton: string;
//     backgroundImage: Image;
//     setTitle(title: string): this;
//     setToken(token: string): this;
//     setBackButton(visibility: string): this;
//     showBackButton(): this;
//     hideBackButton(): this;
//     setBackgroundImage(backgroundImage: string | ImageShort | Image, description?: string): this;
// }
//
// declare class BodyTemplate1 extends Template {
//     textContent: TextContent;
//     setTextContent(primaryText: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
// }
//
// declare class BodyTemplate2 extends BodyTemplate1 {
//     image: Image | ImageShort;
//     setImage(image:string | ImageShort | Image, description?: string): this;
//     setRightImage(image:string | ImageShort | Image, description?: string): this;
// }
//
// declare class BodyTemplate3 extends BodyTemplate1 {
//     image: Image | ImageShort;
//     setImage(image:string | ImageShort | Image, description?: string): this;
//     setLeftImage(image:string | ImageShort | Image, description?: string): this;
// }
//
// declare class BodyTemplate6 extends BodyTemplate1 {
//     setFullScreenImage(image:string | ImageShort | Image, description?: string): this;
// }
//
// declare class BodyTemplate7 extends BodyTemplate1 {
//     image: Image | ImageShort;
//     setImage(image:string | ImageShort | Image, description?: string): this;
// }
// export interface ListItem {
//     token: string;
//     image: Image | ImageShort;
//     textContent: TextContent;
// }
// declare class ListTemplate1 extends Template {
//     listItems: ListItem[];
//     addItem(listItem: ListItem): this;
//     addItem(token: string, image: Image, primaryText?: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
//     addItem(tokenOrListItem: string | ListItem, image?: Image, primaryText?: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
//     setItems(items: ListItem[]): this;
// }
// declare class ListTemplate2 extends ListTemplate1 {}
// declare class ListTemplate3 extends ListTemplate1 {}
//
//
//
// declare class Alexa extends Extensible implements Platform {
//     install(app: BaseApp): void;
//     makeTestSuite(): TestSuite;
// }
//
// declare class AlexaSpeechBuilder extends SpeechBuilder {
//     toSSML(text: string): string;
// }
//
//
// declare class Dialog {
//     getState(): string;
//     isCompleted(): boolean;
//     isInProgress(): boolean;
//     isStarted(): boolean;
//     hasStarted(): boolean;
//     isSlotConfirmed(slotName: string): boolean;
//     getSlotConfirmationStatus(slotName: string): string;
//     isIntentConfirmed(): boolean;
//     getIntentConfirmationStatus(): string;
//     delegate(updatedIntent?: Intent): this;
// }
//
// declare class AlexaRequest implements JovoRequest {
//     toJSON(): AlexaRequestJSON;
//
//     getUserId(): string;
//     setUserId(userId: string): this;
//
//     getAccessToken(): string;
//     setAccessToken(accessToken: string): this;
//
//     getLocale(): string;
//     setLocale(locale: string): this;
//
//     isNewSession(): boolean;
//     setNewSession(isNew: boolean): this;
//
//     getTimestamp(): string;
//     setTimestamp(timestamp: string): this;
//
//     hasAudioInterface(): boolean;
//     hasScreenInterface(): boolean;
//     hasVideoInterface(): boolean;
//
//     getSessionAttributes(): any;
//     setSessionAttributes(attributes: any): this;
//     addSessionAttribute(key: string, value: any): this;
//
//     getIntentName(): string;
//     setIntentName(intentName: string): this;
//     getRequestType(): RequestType;
//
//     setState(state: string): this;
//     getInputs(): any;
//     addInput(key: string, value: string): this;
//
// }
// declare class AlexaResponse implements JovoResponse {
//     version: string;
//     response: Response;
//     sessionAttributes?: any;
//     getOutputSpeech(): string;
//     getRepromptSpeech(): string;
//     getSessionAttributes(): any;
//     hasSessionAttribute(name: string, value?: any): boolean;
//     hasSessionEnded(): boolean;
//     hasState(state: string): boolean;
//     isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean;
//     isTell(speechText?: string | string[]): boolean;
//     setSessionAttributes(sessionAttributes: any): this;
// }
//
// declare class Card {
//     type: string;
// }
//
//
// declare class SimpleCard extends Card {
//     title: string;
//     content: string;
//
//     constructor(simpleCard?: {title: string, content: string});
//     setTitle(title: string): this;
//     setContent(content: string): this;
// }
//

// declare module 'jovo-core/dist/src/Jovo' {
//     interface Jovo {
//         $alexaSkill: AlexaSkill;
//         alexaSkill(): AlexaSkill;
//     }
//
//     interface User {
//         getShoppingList(status?: string): Promise<ShoppingList>;
//         addToShoppingList(value: string, status?: string): Promise<ShoppingListItem>;
//         deleteShoppingListItem(value: string, status?: string): Promise<ShoppingListItem>;
//         updateShoppingList(oldValue: string, newValue: string, newStatus?: string): Promise<ShoppingListItem>;
//
//         getToDoList(status?: string): Promise<ToDoList>;
//         addToToDoList(value: string, status?: string): Promise<ToDoListItem>;
//         deleteToDoListItem(value: string, status?: string): Promise<ToDoListItem>;
//         updateToDoList(oldValue: string, newValue: string, newStatus?: string): Promise<ToDoListItem>;
//
//     }
// }
