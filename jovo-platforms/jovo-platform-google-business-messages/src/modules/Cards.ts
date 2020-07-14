import { Plugin, Util } from 'jovo-core';
import { BusinessMessages } from '../BusinessMessages';
import { BusinessMessagesBot } from '../core/BusinessMessagesBot';
import { BusinessMessagesRequest } from '../core/BusinessMessagesRequest';
import { BusinessMessagesResponse } from '../core/BusinessMessagesResponse';
import {
  CarouselCard,
  CarouselCardResponse,
  RichCard,
  StandaloneCardResponse,
} from '../Interfaces';

export class Cards implements Plugin {
  install(businessMessages: BusinessMessages) {
    businessMessages.middleware('$output')!.use(this.output.bind(this));

    /**
     * Adds carousel to response
     * @public
     * @see https://developers.google.com/business-communications/business-messages/guides/build/send#rich-card-carousels
     * @param {CarouselCard} carousel
     * @return {BusinessMessagesBot}
     */
    BusinessMessagesBot.prototype.showCarousel = function (carousel: CarouselCard) {
      this.$output.BusinessMessages.Carousel = carousel;
      return this;
    };

    BusinessMessagesBot.prototype.showRichCard = function (richCard: RichCard) {
      this.$output.BusinessMessages.RichCard = richCard;
      return this;
    };
  }

  output(businessMessagesBot: BusinessMessagesBot) {
    // might have been initialized by BusinessMessagesCore.ts already
    const response = businessMessagesBot.$response as BusinessMessagesResponse;

    if (!response.response) {
      const request = businessMessagesBot.$request as BusinessMessagesRequest;
      const messageId = Util.randomStr(12);

      response.response = {
        messageId,
        name: `conversations/${request.getSessionId()}/messages/${messageId}`,
        representative: {
          representativeType: 'BOT',
        },
      };
    }

    const carousel = businessMessagesBot.$output.BusinessMessages.Carousel;
    if (carousel) {
      (response.response as CarouselCardResponse).richCard = {
        carouselCard: carousel,
      };
    }

    const richCard = businessMessagesBot.$output.BusinessMessages.RichCard;
    if (richCard) {
      (response.response as StandaloneCardResponse).richCard = {
        standaloneCard: richCard,
      };
    }
  }
}
