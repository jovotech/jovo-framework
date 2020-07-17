import { TestSuite } from 'jovo-core';
import { GoogleBusinessBot } from './core/GoogleBusinessBot';
import { GoogleBusinessRequestBuilder } from './core/GoogleBusinessRequestBuilder';
import { GoogleBusinessResponseBuilder } from './core/GoogleBusinessResponseBuilder';
import { CarouselCard, RichCard, Suggestion } from './Interfaces';

export interface GoogleBusinessTestSuite
  extends TestSuite<GoogleBusinessRequestBuilder, GoogleBusinessResponseBuilder> {}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $googleBusinessBot?: GoogleBusinessBot;
    googleBusinessBot(): GoogleBusinessBot;
  }
}

declare module './core/GoogleBusinessBot' {
  interface GoogleBusinessBot {
    /**
     * Adds carousel to response
     * @public
     * @see https://developers.google.com/business-communications/business-messages/guides/build/send#rich-card-carousels
     * @param {CarouselCard} carousel
     * @return {GoogleBusinessBot}
     */
    showCarousel(carousel: CarouselCard): this;
    showRichCard(card: RichCard): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {
    GoogleBusiness: {
      Suggestions?: Suggestion[];
      Carousel?: CarouselCard;
      RichCard?: RichCard;
    };
  }
}

export { GoogleBusiness } from './GoogleBusiness';
export * from './Interfaces';
export * from './core/GoogleBusinessBot';
export * from './core/GoogleBusinessRequest';
export * from './core/GoogleBusinessResponse';
export * from './core/GoogleBusinessSpeechBuilder';
export * from './core/GoogleBusinessUser';
