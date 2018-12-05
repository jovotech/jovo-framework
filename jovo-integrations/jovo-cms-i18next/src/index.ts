export {I18Next} from './I18Next';
declare module 'jovo-core/dist/src/Cms' {
    interface Cms {
        t(): string;
        i18Next: any; // tslint:disable-line
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        t(): string;
    }
}

declare module 'jovo-core/dist/src/SpeechBuilder' {
    export interface SpeechBuilder {
        t(): void;
        addT(): void;
    }
}
