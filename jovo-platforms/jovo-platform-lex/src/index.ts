import { LexBot } from './core/LexBot';
import { TestSuite } from 'jovo-core';
import { LexRequestBuilder } from './core/LexRequestBuilder';
import { LexResponseBuilder } from './core/LexResponseBuilder';
import { Button } from './response/index';
export const NEW_SESSION_KEY = '_JOVO_NEW_SESSION_';

export interface LexTestSuite extends TestSuite<LexRequestBuilder, LexResponseBuilder> {}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $lexBot?: LexBot;

    lexBot(): LexBot;

    isLexBot(): boolean;
  }
}
// Cards
declare module './core/LexBot' {
  interface LexBot {
    showStandardCard(
      title: string,
      subtitle: string,
      imageUrl: string,
      attachmentLinkUrl: string,
      buttons: Button[],
    ): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    Lex: {};
  }
}

export { Lex } from './Lex';
export { LexBot } from './core/LexBot';
export { Cards } from './modules/Cards';
