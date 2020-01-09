import { Plugin } from 'jovo-core';
import { AdaptiveCard, AdaptiveCardOptions, CorePlatformResponse, CorePlatformApp } from '..';
import {CorePlatform} from '../CorePlatform';
import _get = require('lodash.get');
import _set = require('lodash.set');

interface SimpleCard {
  title: string;
  content: string;
}

interface ImageCard extends SimpleCard {
  imageUrl: string;
}

export class Cards implements Plugin {
  install(corePlatform: CorePlatform): void {
    corePlatform.middleware('$output')!.use(this.output.bind(this));

    CorePlatformApp.prototype.showAdaptiveCard = function(options: AdaptiveCardOptions) {
      _set(this.$output, 'CorePlatform.AdaptiveCard', options);
      return this;
    };

    CorePlatformApp.prototype.showSuggestionChips = function(chips: string[]) {
      if (!this.$output.CorePlatform) {
        this.$output.CorePlatform = {};
      }

      this.$output.CorePlatform.SuggestionChips = chips;
      return this;
    };
  }

  output(corePlatformApp: CorePlatformApp) {
    const output = corePlatformApp.$output;
    if (!corePlatformApp.$response) {
      corePlatformApp.$response = new CorePlatformResponse();
    }

    const suggestionChips: string[] | undefined = _get(output, 'CorePlatform.SuggestionChips');
    if (suggestionChips && suggestionChips.length > 0) {
      _set(corePlatformApp.$response, 'response.output.suggestionChips', suggestionChips);
    }

    const simpleCardOptions: SimpleCard | undefined = _get(output, 'card.SimpleCard');
    if (simpleCardOptions) {
      _set(
          corePlatformApp.$response,
        'response.output.card',
        new AdaptiveCard({
          body: [
            { type: 'TextBlock', text: simpleCardOptions.title, size: 'large' },
            { type: 'TextBlock', text: simpleCardOptions.content },
          ],
        }),
      );
    }

    const imageCardOptions: ImageCard | undefined = _get(output, 'card.ImageCard');
    if (imageCardOptions) {
      _set(
          corePlatformApp.$response,
        'response.output.card',
        new AdaptiveCard({
          body: [
            { type: 'TextBlock', text: imageCardOptions.title, size: 'large' },
            { type: 'Image', url: imageCardOptions.imageUrl },
            { type: 'TextBlock', text: imageCardOptions.content },
          ],
        }),
      );
    }

    const adaptiveCardOptions: AdaptiveCardOptions | undefined =
      _get(output, 'CorePlatform.AdaptiveCard') || _get(output, 'card.AdaptiveCard');
    if (adaptiveCardOptions) {
      _set(corePlatformApp.$response, 'response.output.card', new AdaptiveCard(adaptiveCardOptions));
    }

    // TODO finish account linking card
    const accountLinkingCard = _get(output, 'card.AccountLinkingCard');
    if (accountLinkingCard) {
      _set(
          corePlatformApp.$response,
        'response.output.card',
        new AdaptiveCard({
          body: [],
        }),
      );
    }
  }
}
