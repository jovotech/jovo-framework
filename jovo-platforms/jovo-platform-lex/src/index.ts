import {LexBot} from './core/LexBot';
import {TestSuite} from 'jovo-core';
import {LexRequestBuilder} from './core/LexRequestBuilder';
import {LexResponseBuilder} from './core/LexResponseBuilder';

export interface LexTestSuite
  extends TestSuite<LexRequestBuilder, LexResponseBuilder> {
}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $lexBot?: LexBot;
    lexBot(): LexBot;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    Lex: {};
  }
}

export {Lex} from './Lex';
