import { Plugin, Util } from 'jovo-core';
import { GoogleBusinessBot } from '../core/GoogleBusinessBot';
import { GoogleBusinessRequest } from '../core/GoogleBusinessRequest';
import { GoogleBusinessResponse } from '../core/GoogleBusinessResponse';
import { GoogleBusiness } from '../GoogleBusiness';
import {
  CarouselCard,
  CarouselCardResponse,
  StandaloneCard,
  StandaloneCardResponse,
} from '../Interfaces';

export class Cards implements Plugin {
  install(googleBusiness: GoogleBusiness) {
    googleBusiness.middleware('$output')!.use(this.output.bind(this));

    /**
     * Adds carousel to response
     * @public
     * @see https://developers.google.com/business-communications/business-messages/guides/build/send#rich-card-carousels
     * @param {CarouselCard} carousel
     * @return {GoogleBusinessBot}
     */
    GoogleBusinessBot.prototype.showCarousel = function (carousel: CarouselCard) {
      this.$output.GoogleBusiness.Carousel = carousel;
      return this;
    };

    GoogleBusinessBot.prototype.showStandaloneCard = function (card: StandaloneCard) {
      this.$output.GoogleBusiness.StandaloneCard = card;
      return this;
    };
  }

  async output(googleBusinessBot: GoogleBusinessBot) {
    // might have been initialized by GoogleBusinessCore.ts already
    if (!googleBusinessBot.$response) {
      googleBusinessBot.$response = new GoogleBusinessResponse();
    }
    const response = googleBusinessBot.$response as GoogleBusinessResponse;

    if (!response.response) {
      const request = googleBusinessBot.$request as GoogleBusinessRequest;
      const messageId = Util.randomStr(12);

      response.response = {
        messageId,
        name: `conversations/${request.getSessionId()}/messages/${messageId}`,
        representative: {
          representativeType: 'BOT',
        },
      };
    }

    const carousel = googleBusinessBot.$output.GoogleBusiness.Carousel;
    if (carousel) {
      (response.response as CarouselCardResponse).richCard = {
        carouselCard: carousel,
      };
    }

    const standaloneCard = googleBusinessBot.$output.GoogleBusiness.StandaloneCard;
    if (standaloneCard) {
      (response.response as StandaloneCardResponse).richCard = {
        standaloneCard,
      };
    }
  }
}
