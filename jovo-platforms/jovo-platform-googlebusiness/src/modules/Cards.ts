import { Plugin } from 'jovo-core';
import { GoogleBusinessBot } from '../core/GoogleBusinessBot';
import { GoogleBusiness } from '../GoogleBusiness';
import {
  CarouselCard,
  CarouselCardResponse,
  StandaloneCard,
  StandaloneCardResponse,
} from '../Interfaces';
import { GoogleBusinessAPI } from '../services/GoogleBusinessAPI';

export class Cards implements Plugin {
  install(googleBusiness: GoogleBusiness) {
    GoogleBusinessBot.prototype.showCarousel = async function (
      carousel: CarouselCard,
      fallback?: string,
    ) {
      const data: CarouselCardResponse = {
        ...this.makeBaseResponse(),
        fallback,
        richCard: {
          carouselCard: carousel,
        },
      };
      await GoogleBusinessAPI.sendResponse({
        data,
        serviceAccount: this.$config.plugin!.GoogleBusiness.serviceAccount,
        sessionId: this.$request!.getSessionId()!,
      });
    };

    GoogleBusinessBot.prototype.showStandaloneCard = async function (
      card: StandaloneCard,
      fallback?: string,
    ) {
      const data: StandaloneCardResponse = {
        ...this.makeBaseResponse(),
        fallback,
        richCard: {
          standaloneCard: card,
        },
      };
      await GoogleBusinessAPI.sendResponse({
        data,
        serviceAccount: this.$config.plugin!.GoogleBusiness.serviceAccount,
        sessionId: this.$request!.getSessionId()!,
      });
    };
  }
}
