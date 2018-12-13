import {
    ActionSet,
    SpeechBuilder,
    Middleware,
    TestSuite, RequestBuilder, ResponseBuilder,
    Conversation, ConversationConfig,
    Extensible, ExtensibleConfig,
    // BaseApp,
    Jovo,
    User
} from './index';
import {BaseApp} from "./BaseApp";




export interface Data {
    [key: string]: any; // tslint:disable-line
}

export interface JovoData extends Data {}
export interface AppData extends Data {}
export interface SessionData extends Data {}


export interface Plugin {
    name?: string;
    config?: PluginConfig;
    install(parent: object): void;
    uninstall(parent?: any): void; // tslint:disable-line
}

export interface PluginConfig {
    enabled?: boolean;
}

export interface HandleRequest {
    app: BaseApp;
    host: Host;
    jovo?: Jovo;
    error?: Error;
    platformClazz?: any; // tslint:disable-line
}

// specialized plugins
export interface Db extends Plugin {
    needsWriteFileAccess: boolean;
    save(primaryKey: string, key: string, data: any): Promise<any>; // tslint:disable-line
    load(primaryKey: string): Promise<any>; // tslint:disable-line
    delete(primaryKey: string): Promise<any>; // tslint:disable-line
}

export interface Platform extends Plugin {
    requestBuilder: RequestBuilder;
    responseBuilder: ResponseBuilder;
    makeTestSuite(): TestSuite;
}

export interface PlatformConfig extends ExtensibleConfig, PluginConfig {

}



export interface Analytics extends Plugin {
    track(handleRequest: HandleRequest): void;
}


export interface AppConfig extends ExtensibleConfig {
    // logging?: boolean;
    intentMap?: {[key: string]: string};
    inputMap?: {[key: string]: string};
}

export interface RequestType {
    type?: string;
    subType?: string;
}

export interface Output {
    tell?: {
        speech: string | SpeechBuilder;
    };

    ask?: {
        speech: string | SpeechBuilder;
        reprompt: string | SpeechBuilder | string[];
    };

    card?: {
        SimpleCard?: {
            title: string;
            content: string;
        }
        ImageCard?: {
            title: string;
            content: string;
            imageUrl: string;
        }
        AccountLinkingCard?: object;
    };
}

export interface JovoRequest {
    toJSON(): any; // tslint:disable-line

    getUserId(): string;
    getAccessToken(): string;
    getLocale(): string;
    isNewSession(): boolean;
    getTimestamp(): string;

    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;

    getSessionAttributes(): SessionAttributes;
    addSessionAttribute(key: string, value: any): this; // tslint:disable-line

    setTimestamp(timestamp: string): this;
    setLocale(locale: string): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setNewSession(isNew: boolean): this;
    setAudioInterface(): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setSessionAttributes(attributes: SessionAttributes): this;
    setState(state: string): this;

    getInputs(): any; // tslint:disable-line
    addInput(key: string, value: string): this;
}

export interface Input {
    key?: string;
    value?: string;
    id?: string;
}

export interface Inputs {
    [key: string]: Input;
}

export interface SessionAttributes {
    [key: string]: any; // tslint:disable-line
}

export interface JovoResponse {
    getOutputSpeech(): string | undefined;
    getRepromptSpeech(): string | undefined;

    getSessionAttributes(): SessionAttributes | undefined;
    setSessionAttributes(sessionAttributes: SessionAttributes): this;

    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean;
    hasState(state: string): boolean | undefined;
    hasSessionAttribute(name: string, value?: any): boolean; // tslint:disable-line
    hasSessionEnded(): boolean;
}

export interface JovoSession {
    $data: SessionData // tslint:disable-line
}


export interface Host {
    hasWriteFileAccess: boolean;
    headers: {[key: string]: string};
    $request: any; // tslint:disable-line
    getRequestObject(): any; // tslint:disable-line
    setResponse(obj: any): Promise<any>; // tslint:disable-line
}

export interface NLUData {
    intent?: {
        name: string;
    };
    inputs?: Map<string, any>; // tslint:disable-line
}
