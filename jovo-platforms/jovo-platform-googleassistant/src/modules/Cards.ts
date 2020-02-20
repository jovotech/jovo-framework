import { Plugin, EnumRequestType } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { BasicCard, Carousel, CarouselBrowse, List, Table } from '../index';
import { GoogleActionResponse } from '../core/GoogleActionResponse';

export class Cards implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    /**
     * Adds basic card to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {BasicCard} basicCard
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showBasicCard = function(basicCard: BasicCard) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.card = {
        BasicCard: basicCard,
      };

      return this;
    };

    /**
     * Adds suggestion chips to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Array<String>} chips
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showSuggestionChips = function(chips: string[]) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.SuggestionChips = chips;
      return this;
    };

    /**
     * Adds link out suggestion chip to response
     * @public
     * @param {string} destinationName
     * @param {string} url
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showLinkOutSuggestion = function(destinationName: string, url: string) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.LinkOutSuggestion = {
        destinationName,
        url,
      };
      return this;
    };

    /**
     * Adds carousel element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carousel
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showCarousel = function(carousel: Carousel) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.Carousel = carousel;
      return this;
    };

    /**
     * Adds carousel browse element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carouselBrowse
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showCarouselBrowse = function(carouselBrowse: CarouselBrowse) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.CarouselBrowse = carouselBrowse;
      return this;
    };

    /**
     * Implementation of generic withSimpleTable
     * Shows a simple table card to the response object
     * @public
     * @param {string} title
     * @param {string} subtitle
     * @param {array} columnHeaders
     * @param {array} rowsText
     * @return {GoogleAction} this
     */
    GoogleAction.prototype.showSimpleTable = function(
      title: string,
      subtitle: string,
      columnHeaders: string[],
      rowsText: string[][],
    ) {
      // tslint:disable-line
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }
      this.$output.GoogleAssistant.Table = new Table()
        .setTitle(title)
        .setSubtitle(subtitle)
        .addColumns(columnHeaders)
        .addRows(rowsText);
      return this;
    };

    /**
     * Adds table to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Table} table
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showTable = function(table: Table) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.Table = table;
      return this;
    };
    /**
     * Adds list element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {List} list
     * @return {GoogleAction}
     */
    GoogleAction.prototype.showList = function(list: List) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }

      this.$output.GoogleAssistant.List = list;
      return this;
    };

    /**
     * Returns token of the request
     * (Touched/Selected Element )
     * @public
     * @return {*}
     */
    GoogleAction.prototype.getSelectedElementId = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'OPTION') {
          return _get(argument, 'textValue');
        }
      }
    };
  }
  type(googleAction: GoogleAction) {
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.OPTION'
    ) {
      googleAction.$type.type = EnumRequestType.ON_ELEMENT_SELECTED;

      for (const argument of _get(
        googleAction.$originalRequest || googleAction.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'OPTION') {
          _set(googleAction.$type, 'subType', _get(argument, 'textValue'));
        }
      }
    }
  }
  output(googleAction: GoogleAction) {
    if (!googleAction.hasScreenInterface()) {
      return;
    }
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }
    const output = googleAction.$output;

    const cardSimpleCard =
      _get(output, 'GoogleAssistant.card.SimpleCard') || _get(output, 'card.SimpleCard');
    if (cardSimpleCard) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        basicCard: new BasicCard()
          .setTitle(_get(cardSimpleCard, 'title'))
          .setFormattedText(_get(cardSimpleCard, 'content')),
      });
      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }

    const cardImageCard =
      _get(output, 'GoogleAssistant.card.ImageCard') || _get(output, 'card.ImageCard');
    if (cardImageCard) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        basicCard: new BasicCard()
          .setTitle(_get(cardImageCard, 'title'))
          .setFormattedText(_get(cardImageCard, 'content'))
          .setImage({
            url: _get(cardImageCard, 'imageUrl'),
            accessibilityText: _get(cardImageCard, 'title'),
          }),
      });

      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }

    if (_get(output, 'card.AccountLinkingCard')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.SIGN_IN',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
          'optContext':
            _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech')) || '',
        },
      });
      _set(googleAction.$originalResponse, 'inputPrompt', {
        initialPrompts: [
          {
            textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
          },
        ],
        noInputPrompts: [],
      });
    }

    const cardBasicCard = _get(output, 'GoogleAssistant.card.BasicCard');
    if (cardBasicCard) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        basicCard: cardBasicCard,
      });
      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }

    if (_get(output, 'GoogleAssistant.SuggestionChips')) {
      const suggestionChips = _get(googleAction.$originalResponse, 'richResponse.suggestions', []);

      _get(output, 'GoogleAssistant.SuggestionChips').forEach((chip: string) => {
        suggestionChips.push({
          title: chip,
        });
      });
      _set(googleAction.$originalResponse, 'richResponse.suggestions', suggestionChips);
    }

    if (_get(output, 'GoogleAssistant.LinkOutSuggestion')) {
      _set(googleAction.$originalResponse, 'richResponse.linkOutSuggestion', {
        destinationName: _get(output, 'GoogleAssistant.LinkOutSuggestion.destinationName'),
        url: _get(output, 'GoogleAssistant.LinkOutSuggestion.url'),
      });
    }

    if (_get(output, 'GoogleAssistant.Carousel')) {
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.OPTION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
          'carouselSelect': _get(output, 'GoogleAssistant.Carousel'),
        },
      });
    }

    if (_get(output, 'GoogleAssistant.List')) {
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.OPTION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
          'listSelect': _get(output, 'GoogleAssistant.List'),
        },
      });
    }

    if (_get(output, 'GoogleAssistant.CarouselBrowse')) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        carouselBrowse: _get(output, 'GoogleAssistant.CarouselBrowse'),
      });
    }

    if (_get(output, 'GoogleAssistant.Table')) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        tableCard: _get(output, 'GoogleAssistant.Table'),
      });
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
