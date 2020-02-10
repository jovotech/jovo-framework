import { Plugin } from 'jovo-core';

import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
import { AutopilotResponse } from '../core/AutopilotResponse';

export interface ImageItem {
  label?: string;
  url: string;
}

export interface StandardCard {
  body: string;
  images?: ImageItem[];
}

export class Cards implements Plugin {
  install(autopilot: Autopilot) {
    autopilot.middleware('$output')!.use(this.output.bind(this));

    /**
     * naming: twilio names it just `show`
     */
    AutopilotBot.prototype.showStandardCard = function(
      content: string,
      images?: ImageItem[] | ImageItem,
    ) {
      const card: StandardCard = {
        body: content,
      };

      if (Array.isArray(images)) {
        card.images = images;
      } else if (typeof images === 'object') {
        card.images = [images];
      }

      if (!this.$output.Autopilot.card) {
        this.$output.Autopilot.card = {};
      }
      this.$output.Autopilot.card.StandardCard = card;

      return this;
    };
  }

  uninstall(autopilot: Autopilot) {}

  output(autopilotBot: AutopilotBot) {
    const output = autopilotBot.$output;
    const response = autopilotBot.$response as AutopilotResponse;

    if (output.card?.SimpleCard) {
      const card = output.card.SimpleCard;
      const show: StandardCard = {
        body: card.content,
      };

      response.actions.unshift({ show });
    }

    if (output.card?.ImageCard) {
      const card = output.card.ImageCard;
      const show: StandardCard = {
        body: card.content,
        images: [
          {
            url: card.imageUrl,
          },
        ],
      };

      response.actions.unshift({ show });
    }

    if (output.Autopilot.card?.StandardCard) {
      response.actions.unshift({ show: output.Autopilot.card.StandardCard });
    }
  }
}
