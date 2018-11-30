import {Plugin} from "jovo-core";
import * as _ from "lodash";
import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {BasicCard, Carousel, CarouselBrowse, List, Table} from "..";
import {GoogleActionResponse} from "../core/GoogleActionResponse";


export class Cards implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$type')!.use(this.type.bind(this));
        googleAssistant.middleware('$output')!.use(this.output.bind(this));

        GoogleAction.prototype.showBasicCard = function(basicCard: BasicCard) {
            this.$output.GoogleAssistant = {
                card: {
                    BasicCard: basicCard
                }
            };

            return this;
        };

        GoogleAction.prototype.showSuggestionChips = function(chips: string[]) {
            this.$output.GoogleAssistant = {
                SuggestionChips: chips,
            };
            return this;
        };

        GoogleAction.prototype.showLinkOutSuggestion = function(destinationName: string, url: string) {
            this.$output.GoogleAssistant = {
                LinkOutSuggestion: {
                    destinationName,
                    url
                },
            };
            return this;
        };

        GoogleAction.prototype.showCarouselBrowse = function(carouselBrowse: CarouselBrowse) {
            this.$output.GoogleAssistant = {
                CarouselBrowse: carouselBrowse,
            };
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
        GoogleAction.prototype.showSimpleTable = function(title: string, subtitle: string, columnHeaders: any[], rowsText: any[]) { // tslint:disable-line
            const table = new Table().setTitle(title).setSubtitle(subtitle).addColumns(columnHeaders).addRows(rowsText);
            this.$output.GoogleAssistant = {
                Table: table,
            };
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
            this.$output.GoogleAssistant = {
                Table: table,
            };
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
            this.$output.GoogleAssistant = {
                List: list,
            };
            return this;
        };

        GoogleAction.prototype.getSelectedElementId = function() {
            for (const argument of _.get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'OPTION') {
                    return _.get(argument, 'textValue');
                }
            }
        };

    }
    type(googleAction: GoogleAction) {
        if (_.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.OPTION') {
            _.set(googleAction.$type, 'type', 'ON_ELEMENT_SELECTED'); // TODO: constant

            for (const argument of _.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'OPTION') {
                    _.set(googleAction.$type, 'subType', _.get(argument, 'textValue'));
                }
            }
        }
    }
    output(googleAction: GoogleAction) {

        if (!googleAction.hasScreenInterface()) {
            return;
        }
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const output = googleAction.$output;

        const cardSimpleCard = _.get(output, 'GoogleAssistant.card.SimpleCard') || _.get(output, 'card.SimpleCard');
        if (cardSimpleCard) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new BasicCard()
                    .setTitle(_.get(cardSimpleCard, 'title'))
                    .setFormattedText(_.get(cardSimpleCard, 'text'))
            });
            _.set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        const cardImageCard = _.get(output, 'GoogleAssistant.card.ImageCard') || _.get(output, 'card.ImageCard');
        if (cardImageCard) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new BasicCard()
                    .setTitle(_.get(cardImageCard, 'title'))
                    .setFormattedText(_.get(cardImageCard, 'text'))
                    .setImage({
                        url: _.get(cardImageCard, 'imageUrl'),
                        accessibilityText: _.get(cardImageCard, 'title'),
                    })
            });

            _.set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        if (_.get(output, 'card.AccountLinkingCard')) {
            _.set(googleAction.$response, 'expectUserResponse', true);


            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    optContext: _.get(output, 'ask.speech', _.get(output, 'GoogleAssistant.ask.speech')) || '',
                }
            });
            _.set(googleAction.$response, 'inputPrompt', {
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                    },
                ],
                noInputPrompts: [],
            });
        }


        const cardBasicCard = _.get(output, 'GoogleAssistant.card.BasicCard');

        if (cardBasicCard) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: cardBasicCard
            });
            _.set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        if (_.get(output, 'GoogleAssistant.SuggestionChips')) {
            const suggestionChips = _.get(googleAction.$response, 'richResponse.suggestions', []);

            _.get(output, 'GoogleAssistant.SuggestionChips').forEach((chip: string) => {
                suggestionChips.push({
                    title: chip
                });
            });
            _.set(googleAction.$response, 'richResponse.suggestions', suggestionChips);
        }

        if (_.get(output, 'GoogleAssistant.LinkOutSuggestion')) {
            _.set(googleAction.$response, 'richResponse.linkOutSuggestion', {
                destinationName: _.get(output, 'GoogleAssistant.LinkOutSuggestion.destinationName'),
                url: _.get(output, 'GoogleAssistant.LinkOutSuggestion.url'),
            });
        }

        if (_.get(output, 'GoogleAssistant.Carousel')) {
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
                    carouselSelect: _.get(output, 'GoogleAssistant.Carousel'),
                }
            });
        }

        if (_.get(output, 'GoogleAssistant.List')) {
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
                    listSelect: _.get(output, 'GoogleAssistant.List'),
                }
            });
        }

        if (_.get(output, 'GoogleAssistant.CarouselBrowse')) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                carouselBrowse: _.get(output, 'GoogleAssistant.CarouselBrowse')
            });
        }

        if (_.get(output, 'GoogleAssistant.Table')) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                tableCard: _.get(output, 'GoogleAssistant.Table')
            });
        }
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }
}
