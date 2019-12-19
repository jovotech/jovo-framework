export { I18Next, Config } from './I18Next';
declare module 'jovo-core/dist/src/util/Cms' {
  export interface Cms {
    t(key: string, obj?: any): string | string[]; // tslint:disable-line
  }
}

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    t(key: string, obj?: any): string | string[]; // tslint:disable-line
  }
}

declare module 'jovo-core/dist/src/util/SpeechBuilder' {
  export interface SpeechBuilder {
    t(key: string, obj?: any): this; // tslint:disable-line
    addT(key: string, obj?: any): this; // tslint:disable-line
  }
}
