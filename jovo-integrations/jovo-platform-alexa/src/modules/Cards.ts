import {Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";
import * as _ from "lodash";
import {AlexaSkill} from "../core/AlexaSkill";
import {SimpleCard} from "../response/visuals/SimpleCard";
import {StandardCard} from "../response/visuals/StandardCard";
import {LinkAccountCard} from "../response/visuals/LinkAccountCard";
import {AskForLocationPermissionsCard} from "../response/visuals/AskForLocationPermissionsCard";
import {AskForListPermissionsCard} from "../response/visuals/AskForListPermissionsCard";
import {AskForContactPermissionsCard} from "../response/visuals/AskForContactPermissionsCard";
import {Card} from "../response/visuals/Card";
import {AlexaResponse} from "..";


export class Cards implements Plugin {


    install(alexa: Alexa) {

        alexa.middleware('$output')!.use(this.output.bind(this));

        AlexaSkill.prototype.showStandardCard = function(title: string, text: string, image: {smallImageUrl: string, largeImageUrl: string}) {
            _.set(this.$output, 'Alexa.StandardCard',
                new StandardCard()
                    .setTitle(title)
                    .setText(text)
                    .setSmallImageUrl(image.smallImageUrl)
                    .setLargeImageUrl(image.largeImageUrl)
            );
            return this;
        };
        AlexaSkill.prototype.showAskForCountryAndPostalCodeCard = function() {
            _.set(this.$output, 'Alexa.AskForPermissionsConsentCard',
                new AskForLocationPermissionsCard()
                    .setAskForCountryAndPostalCodePermission()
            );
            return this;
        };

        AlexaSkill.prototype.showAskForCountryAndPostalCodeCard = function() {
            _.set(this.$output, 'Alexa.AskForPermissionsConsentCard',
                new AskForLocationPermissionsCard()
                    .setAskForAddressPermission()
            );
            return this;
        };

        AlexaSkill.prototype.showAskForListPermissionCard = function(types: string[]) {
            _.set(this.$output, 'Alexa.AskForPermissionsConsentCard',
                new AskForListPermissionsCard(types)
            );
            return this;
        };

        AlexaSkill.prototype.showAskForContactPermissionCard = function(contactProperties: string[]) {
            _.set(this.$output, 'Alexa.AskForPermissionsConsentCard',
                new AskForContactPermissionsCard(contactProperties)
            );
            return this;
        };
        AlexaSkill.prototype.showCard = function(card: Card) {
            _.set(this.$output, `Alexa.${card.constructor.name}`,
                card
            );
            return this;
        };

    }
    uninstall(alexa: Alexa) {
    }

    output(alexaSkill: AlexaSkill) {

        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new AlexaResponse();
        }
        const cardSimpleCard = _.get(output, 'Alexa.card.SimpleCard') || _.get(output, 'card.SimpleCard');
        if (cardSimpleCard) {
            _.set(alexaSkill.$response, 'response.card',
                new SimpleCard()
                    .setTitle(_.get(cardSimpleCard, 'title'))
                    .setContent(_.get(cardSimpleCard, 'text'))
            );
        }
        const cardImageCard = _.get(output, 'Alexa.card.ImageCard') || _.get(output, 'card.ImageCard');
        if (cardImageCard) {
            _.set(alexaSkill.$response, 'response.card',
                new StandardCard()
                    .setTitle(_.get(cardImageCard, 'title'))
                    .setText(_.get(cardImageCard, 'text'))
                    .setSmallImageUrl(_.get(cardImageCard, 'imageUrl'))
                    .setLargeImageUrl(_.get(cardImageCard, 'imageUrl'))
            );
        }

        if (_.get(output, 'card.AccountLinkingCard')) {
            _.set(alexaSkill.$response, 'response.card',
                new LinkAccountCard()
            );
        }


        // alexa specific
        if (_.get(output, 'Alexa.SimpleCard')) {
            _.set(alexaSkill.$response, 'response.card',
                _.get(output, 'Alexa.SimpleCard')
            );
        }

        if (_.get(output, 'Alexa.StandardCard')) {
            _.set(alexaSkill.$response, 'response.card',
                _.get(output, 'Alexa.StandardCard')
            );
        }

        if (_.get(output, 'Alexa.LinkAccountCard')) {
            _.set(alexaSkill.$response, 'response.card',
                new LinkAccountCard()
            );
        }


        if (_.get(output, 'Alexa.AskForPermissionsConsentCard')) {
            _.set(alexaSkill.$response, 'response.card',
                _.get(output, 'Alexa.AskForPermissionsConsentCard')
            );
        }


    }

}
