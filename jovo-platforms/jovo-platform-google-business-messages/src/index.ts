import { TestSuite } from 'jovo-core';
import { BusinessMessagesBot } from './core/BusinessMessagesBot';
import { BusinessMessagesRequestBuilder } from './core/BusinessMessagesRequestBuilder';
import { BusinessMessagesResponseBuilder } from './core/BusinessMessagesResponseBuilder';
import { CarouselCard, RichCard, Suggestion } from './Interfaces';

export interface BusinessMessagesTestSuite
  extends TestSuite<BusinessMessagesRequestBuilder, BusinessMessagesResponseBuilder> {}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $businessMessagesBot?: BusinessMessagesBot;
    businessMessagesBot(): BusinessMessagesBot;
  }
}

declare module './core/BusinessMessagesBot' {
  interface BusinessMessagesBot {
    /**
     * Adds carousel to response
     * @public
     * @see https://developers.google.com/business-communications/business-messages/guides/build/send#rich-card-carousels
     * @param {CarouselCard} carousel
     * @return {BusinessMessagesBot}
     */
    showCarousel(carousel: CarouselCard): this;
    showRichCard(card: RichCard): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {
    BusinessMessages: {
      Suggestions?: Suggestion[];
      Carousel?: CarouselCard;
      RichCard?: RichCard;
    };
  }
}

export { BusinessMessages } from './BusinessMessages';
export * from './Interfaces';
export * from './core/BusinessMessagesBot';
export * from './core/BusinessMessagesRequest';
export * from './core/BusinessMessagesResponse';
export * from './core/BusinessMessagesSpeechBuilder';
export * from './core/BusinessMessagesUser';
