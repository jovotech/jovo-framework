import {App} from "./App";

import {UserMetaData, UserContext, ContextPrevObject} from "./middleware/user/JovoUser";
import {Jovo} from 'jovo-core';
export { App } from './App';
export { server as Webhook } from './server';
export { verifiedServer as WebhookVerified } from './server';

export { ExpressJS } from './hosts/ExpressJS';
export { Lambda } from './hosts/Lambda';


export { BasicLogging } from './middleware/logging/BasicLogging';
export { Router } from './middleware/Router';
export { JovoUser, UserMetaData, ContextPrevObject } from './middleware/user/JovoUser';
export { Util } from './Util';


declare module 'jovo-core/dist/src/Interfaces' {
    interface AppConfig {
        handlers?: any; // tslint:disable-line
        intentsToSkipUnhandled?: string[];
    }
}
declare module 'express' {
    interface Application {
        jovoApp?: App;
    }
}



type HandlerReturnType = Function | Promise<Function> | Promise<Jovo> | Promise<void> | void;
type JovoFunction = (this: Jovo, done?: Function) => HandlerReturnType;


interface Handler {
    [key: string]: JovoFunction | Handler | Function;
}

declare module 'jovo-core/dist/src/BaseApp' {
    export interface BaseApp {
        setHandler(...handler: Handler[]): this;
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        triggeredToIntent: boolean;
        getHandlerPath(): string;
        toIntent(intent: string): Promise<void>;
        toStateIntent(state: string | undefined, intent: string): Promise<void>;
        toStatelessIntent(intent: string): Promise<void>;
        followUpState(state: string): this;
        getHandlerPath(): string;
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        repeat(): void;
    }
}

declare module 'jovo-core/dist/src/User' {
    interface User {
        $metaData: UserMetaData;
        $data: any; // tslint:disable-line
        $context: UserContext;
        isDeleted: boolean;
        getPrevIntent(index: number): string | undefined;
        getPrevRequestState(index: number): string | undefined;
        getPrevResponseState(index: number): string | undefined;
        getPrevInputs(index: number): object | undefined;
        getPrevTimestamp(index: number): string | undefined;

        getPrevSpeech(index: number): string | undefined;
        getPrevReprompt(index: number): string | undefined;

        delete(): void;
        loadData(): Promise<any>; // tslint:disable-line
        saveData(): Promise<void>;

    }
}
