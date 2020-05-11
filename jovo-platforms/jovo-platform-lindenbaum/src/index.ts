import { TestSuite } from 'jovo-core';

import { LindenbaumBot } from './core/LindenbaumBot';
import { LindenbaumRequestBuilder } from './core/LindenbaumRequestBuilder';
import { LindenbaumResponseBuilder } from './core/LindenbaumResponseBuilder';

export interface LindenbaumTestSuite
  extends TestSuite<LindenbaumRequestBuilder, LindenbaumResponseBuilder> {}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $lindenbaumBot?: LindenbaumBot;
    lindenbaumBot(): LindenbaumBot;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {
    // tslint:disable-next-line:no-any
    Lindenbaum: any[];
  }
}

export * from './Lindenbaum';
export * from './ExpressJsMiddleware';
export * from './core/LindenbaumBot';
export * from './core/LindenbaumRequest';
export * from './core/LindenbaumResponse';
export * from './core/LindenbaumSpeechBuilder';
export * from './core/LindenbaumUser';
