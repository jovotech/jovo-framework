"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const AlexaSkill_1 = require("../core/AlexaSkill");
const SimpleCard_1 = require("../response/visuals/SimpleCard");
const StandardCard_1 = require("../response/visuals/StandardCard");
const LinkAccountCard_1 = require("../response/visuals/LinkAccountCard");
const AskForLocationPermissionsCard_1 = require("../response/visuals/AskForLocationPermissionsCard");
const AskForListPermissionsCard_1 = require("../response/visuals/AskForListPermissionsCard");
const AskForContactPermissionsCard_1 = require("../response/visuals/AskForContactPermissionsCard");
const index_1 = require("../index");
class Cards {
    install(alexa) {
        alexa.middleware('$output').use(this.output.bind(this));
        /**
         * Implementation of standard card
         * Show a standard card with a card to the response object
         * @public
         * @param {string} title
         * @param {string} text
         * @param {*} image object with secured image url
         * @return {AlexaSkill} this
         */
        AlexaSkill_1.AlexaSkill.prototype.showStandardCard = function (title, text, image) {
            _set(this.$output, 'Alexa.StandardCard', new StandardCard_1.StandardCard()
                .setTitle(title)
                .setText(text)
                .setSmallImageUrl(image.smallImageUrl)
                .setLargeImageUrl(image.largeImageUrl));
            return this;
        };
        /**
         * Shows ask for country and postal code card
         * @public
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForPermissionsCard = function (permissions) {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new index_1.AskForPermissionsConsentCard().setPermissions(permissions));
            return this;
        };
        /**
         * Shows ask for country and postal code card
         * @public
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForCountryAndPostalCodeCard = function () {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard().setAskForCountryAndPostalCodePermission());
            return this;
        };
        /**
         * Shows ask for address card
         * @public
         * @return {Jovo}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForAddressCard = function () {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard().setAskForAddressPermission());
            return this;
        };
        /**
         * Shows ask for geolocation card
         * @public
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForGeoLocationCard = function () {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard().setAskForGeoLocationPermission());
            return this;
        };
        /**
         * Shows ask for amazon pay permission card
         * @public
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForAmazonPayPermissionCard = function () {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new index_1.AskForPermissionsConsentCard().setPermissions(['payments:autopay_consent']));
            return this;
        };
        /**
         * Shows ask for list permission card
         * @public
         * @param {Array} types 'write' or 'read'
         * @return {Jovo}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForListPermissionCard = function (types) {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new AskForListPermissionsCard_1.AskForListPermissionsCard(types));
            return this;
        };
        /**
         * Shows ask for list permission card
         * @public
         * @param {Array} contactProperties name|given_name|email|mobile_number
         * @return {Jovo}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForContactPermissionCard = function (contactProperties) {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new AskForContactPermissionsCard_1.AskForContactPermissionsCard(contactProperties));
            return this;
        };
        /**
         * Shows ask for reminders permission card
         * @public
         * @return {Jovo}
         */
        AlexaSkill_1.AlexaSkill.prototype.showAskForRemindersPermissionCard = function () {
            _set(this.$output, 'Alexa.AskForPermissionsConsentCard', new index_1.AskForRemindersPermissionsCard());
            return this;
        };
        /**
         * Adds card to response object
         * @public
         * @param {Card} card
         */
        AlexaSkill_1.AlexaSkill.prototype.showCard = function (card) {
            _set(this.$output, `Alexa.${card.constructor.name}`, card);
            return this;
        };
    }
    uninstall(alexa) { }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new index_1.AlexaResponse();
        }
        const cardSimpleCard = _get(output, 'Alexa.card.SimpleCard') || _get(output, 'card.SimpleCard');
        if (cardSimpleCard) {
            _set(alexaSkill.$response, 'response.card', new SimpleCard_1.SimpleCard()
                .setTitle(_get(cardSimpleCard, 'title'))
                .setContent(_get(cardSimpleCard, 'content')));
        }
        const cardImageCard = _get(output, 'Alexa.card.ImageCard') || _get(output, 'card.ImageCard');
        if (cardImageCard) {
            _set(alexaSkill.$response, 'response.card', new StandardCard_1.StandardCard()
                .setTitle(_get(cardImageCard, 'title'))
                .setText(_get(cardImageCard, 'content'))
                .setSmallImageUrl(_get(cardImageCard, 'imageUrl'))
                .setLargeImageUrl(_get(cardImageCard, 'imageUrl')));
        }
        if (_get(output, 'card.AccountLinkingCard')) {
            _set(alexaSkill.$response, 'response.card', new LinkAccountCard_1.LinkAccountCard());
        }
        // alexa specific
        if (_get(output, 'Alexa.SimpleCard')) {
            _set(alexaSkill.$response, 'response.card', _get(output, 'Alexa.SimpleCard'));
        }
        if (_get(output, 'Alexa.StandardCard')) {
            _set(alexaSkill.$response, 'response.card', _get(output, 'Alexa.StandardCard'));
        }
        if (_get(output, 'Alexa.LinkAccountCard')) {
            _set(alexaSkill.$response, 'response.card', new LinkAccountCard_1.LinkAccountCard());
        }
        if (_get(output, 'Alexa.AskForPermissionsConsentCard')) {
            _set(alexaSkill.$response, 'response.card', _get(output, 'Alexa.AskForPermissionsConsentCard'));
        }
    }
}
exports.Cards = Cards;
//# sourceMappingURL=Cards.js.map