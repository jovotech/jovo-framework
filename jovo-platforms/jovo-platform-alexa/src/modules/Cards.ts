import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { AlexaSkill } from '../core/AlexaSkill';
import { SimpleCard } from '../response/visuals/SimpleCard';
import { StandardCard } from '../response/visuals/StandardCard';
import { LinkAccountCard } from '../response/visuals/LinkAccountCard';
import { AskForLocationPermissionsCard } from '../response/visuals/AskForLocationPermissionsCard';
import { AskForListPermissionsCard } from '../response/visuals/AskForListPermissionsCard';
import { AskForContactPermissionsCard } from '../response/visuals/AskForContactPermissionsCard';
import { Card } from '../response/visuals/Card';
import {
  AlexaResponse,
  AskForPermissionsConsentCard,
  AskForRemindersPermissionsCard,
} from '../index';

export class Cards implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$output')!.use(this.output.bind(this));

    /**
     * Implementation of standard card
     * Show a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} text
     * @param {*} image object with secured image url
     * @return {AlexaSkill} this
     */
    AlexaSkill.prototype.showStandardCard = function (
      title: string,
      text: string,
      image: { smallImageUrl: string; largeImageUrl: string },
    ) {
      _set(
        this.$output,
        'Alexa.StandardCard',
        new StandardCard()
          .setTitle(title)
          .setText(text)
          .setSmallImageUrl(image.smallImageUrl)
          .setLargeImageUrl(image.largeImageUrl),
      );
      return this;
    };

    /**
     * Shows ask for country and postal code card
     * @public
     * @return {AlexaSkill}
     */
    AlexaSkill.prototype.showAskForCountryAndPostalCodeCard = function () {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForLocationPermissionsCard().setAskForCountryAndPostalCodePermission(),
      );
      return this;
    };

    /**
     * Shows ask for address card
     * @public
     * @return {Jovo}
     */
    AlexaSkill.prototype.showAskForAddressCard = function () {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForLocationPermissionsCard().setAskForAddressPermission(),
      );
      return this;
    };

    /**
     * Shows ask for geolocation card
     * @public
     * @return {AlexaSkill}
     */
    AlexaSkill.prototype.showAskForGeoLocationCard = function () {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForLocationPermissionsCard().setAskForGeoLocationPermission(),
      );
      return this;
    };

    /**
     * Shows ask for amazon pay permission card
     * @public
     * @return {AlexaSkill}
     */
    AlexaSkill.prototype.showAskForAmazonPayPermissionCard = function () {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForPermissionsConsentCard().setPermissions(['payments:autopay_consent']),
      );
      return this;
    };

    /**
     * Shows ask for list permission card
     * @public
     * @param {Array} types 'write' or 'read'
     * @return {Jovo}
     */
    AlexaSkill.prototype.showAskForListPermissionCard = function (types: string[]) {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForListPermissionsCard(types),
      );
      return this;
    };

    /**
     * Shows ask for list permission card
     * @public
     * @param {Array} contactProperties name|given_name|email|mobile_number
     * @return {Jovo}
     */
    AlexaSkill.prototype.showAskForContactPermissionCard = function (contactProperties: string[]) {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForContactPermissionsCard(contactProperties),
      );
      return this;
    };

    /**
     * Shows ask for reminders permission card
     * @public
     * @return {Jovo}
     */
    AlexaSkill.prototype.showAskForRemindersPermissionCard = function () {
      _set(
        this.$output,
        'Alexa.AskForPermissionsConsentCard',
        new AskForRemindersPermissionsCard(),
      );
      return this;
    };

    /**
     * Adds card to response object
     * @public
     * @param {Card} card
     */
    AlexaSkill.prototype.showCard = function (card: Card) {
      _set(this.$output, `Alexa.${card.constructor.name}`, card);
      return this;
    };
  }
  uninstall(alexa: Alexa) {}

  output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;
    if (!alexaSkill.$response) {
      alexaSkill.$response = new AlexaResponse();
    }
    const cardSimpleCard = _get(output, 'Alexa.card.SimpleCard') || _get(output, 'card.SimpleCard');
    if (cardSimpleCard) {
      _set(
        alexaSkill.$response,
        'response.card',
        new SimpleCard()
          .setTitle(_get(cardSimpleCard, 'title'))
          .setContent(_get(cardSimpleCard, 'content')),
      );
    }
    const cardImageCard = _get(output, 'Alexa.card.ImageCard') || _get(output, 'card.ImageCard');
    if (cardImageCard) {
      _set(
        alexaSkill.$response,
        'response.card',
        new StandardCard()
          .setTitle(_get(cardImageCard, 'title'))
          .setText(_get(cardImageCard, 'content'))
          .setSmallImageUrl(_get(cardImageCard, 'imageUrl'))
          .setLargeImageUrl(_get(cardImageCard, 'imageUrl')),
      );
    }

    if (_get(output, 'card.AccountLinkingCard')) {
      _set(alexaSkill.$response, 'response.card', new LinkAccountCard());
    }

    // alexa specific
    if (_get(output, 'Alexa.SimpleCard')) {
      _set(alexaSkill.$response, 'response.card', _get(output, 'Alexa.SimpleCard'));
    }

    if (_get(output, 'Alexa.StandardCard')) {
      _set(alexaSkill.$response, 'response.card', _get(output, 'Alexa.StandardCard'));
    }

    if (_get(output, 'Alexa.LinkAccountCard')) {
      _set(alexaSkill.$response, 'response.card', new LinkAccountCard());
    }

    if (_get(output, 'Alexa.AskForPermissionsConsentCard')) {
      _set(
        alexaSkill.$response,
        'response.card',
        _get(output, 'Alexa.AskForPermissionsConsentCard'),
      );
    }
  }
}
