import {App} from "./App";
import {UserMetaData, UserContext, ContextPrevObject} from "./middleware/user/JovoUser";

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

declare module 'jovo-core/dist/src/BaseApp' {
    export interface BaseApp {
        setHandler(...handler: any[]): this; // tslint:disable-line
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        triggeredToIntent: boolean;
        getHandlerPath(): string;
        toIntent(intent: string): void;
        toStateIntent(state: string | undefined, intent: string): void;
        toStatelessIntent(intent: string): void;
        followUpState(state: string): void;
        getHandlerPath(): string;
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        t(): void;
        repeat(): void;
    }
}


declare module 'jovo-core/dist/src/SpeechBuilder' {
    export interface SpeechBuilder {
        t(): void;
        addT(): void;
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
