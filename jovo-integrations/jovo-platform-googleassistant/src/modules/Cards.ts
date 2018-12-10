import {Plugin} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {BasicCard, Carousel, CarouselBrowse, List, Table} from "..";
import {GoogleActionResponse} from "../core/GoogleActionResponse";


export class Cards implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$type')!.use(this.type.bind(this));
        googleAssistant.middleware('$output')!.use(this.output.bind(this));

        GoogleAction.prototype.showBasicCard = function(basicCard: BasicCard) {
            this.$output.GoogleAssistant.card = {
                    BasicCard: basicCard
            };

            return this;
        };

        GoogleAction.prototype.showSuggestionChips = function(chips: string[]) {
            this.$output.GoogleAssistant.SuggestionChips = chips;
            return this;
        };

        GoogleAction.prototype.showLinkOutSuggestion = function(destinationName: string, url: string) {
            this.$output.GoogleAssistant.LinkOutSuggestion =  {
                    destinationName,
                    url
            };
            return this;
        };

        GoogleAction.prototype.showCarouselBrowse = function(carouselBrowse: CarouselBrowse) {
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
        GoogleAction.prototype.showSimpleTable = function(title: string, subtitle: string, columnHeaders: any[], rowsText: any[]) { // tslint:disable-line
            const table = new Table().setTitle(title).setSubtitle(subtitle).addColumns(columnHeaders).addRows(rowsText);
            this.$output.GoogleAssistant.Table = table;
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
            this.$output.GoogleAssistant.List = list;
            return this;
        };

        GoogleAction.prototype.getSelectedElementId = function() {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'OPTION') {
                    return _get(argument, 'textValue');
                }
            }
        };

    }
    type(googleAction: GoogleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.OPTION') {
            _set(googleAction.$type, 'type', 'ON_ELEMENT_SELECTED'); // TODO: constant

            for (const argument of _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0]["arguments"]', [])) {
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
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const output = googleAction.$output;

        const cardSimpleCard = _get(output, 'GoogleAssistant.card.SimpleCard') || _get(output, 'card.SimpleCard');
        if (cardSimpleCard) {
            const richResponseItems = _get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new BasicCard()
                    .setTitle(_get(cardSimpleCard, 'title'))
                    .setFormattedText(_get(cardSimpleCard, 'text'))
            });
            _set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        const cardImageCard = _get(output, 'GoogleAssistant.card.ImageCard') || _get(output, 'card.ImageCard');
        if (cardImageCard) {
            const richResponseItems = _get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new BasicCard()
                    .setTitle(_get(cardImageCard, 'title'))
                    .setFormattedText(_get(cardImageCard, 'text'))
                    .setImage({
                        url: _get(cardImageCard, 'imageUrl'),
                        accessibilityText: _get(cardImageCard, 'title'),
                    })
            });

            _set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        if (_get(output, 'card.AccountLinkingCard')) {
            _set(googleAction.$response, 'expectUserResponse', true);


            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    optContext: _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech')) || '',
                }
            });
            _set(googleAction.$response, 'inputPrompt', {
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                    },
                ],
                noInputPrompts: [],
            });
        }


        const cardBasicCard = _get(output, 'GoogleAssistant.card.BasicCard');
        console.log(output);
        if (cardBasicCard) {
            const richResponseItems = _get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: cardBasicCard
            });
            _set(googleAction.$response, 'richResponse.items', richResponseItems);
        }

        if (_get(output, 'GoogleAssistant.SuggestionChips')) {
            const suggestionChips = _get(googleAction.$response, 'richResponse.suggestions', []);

            _get(output, 'GoogleAssistant.SuggestionChips').forEach((chip: string) => {
                suggestionChips.push({
                    title: chip
                });
            });
            _set(googleAction.$response, 'richResponse.suggestions', suggestionChips);
        }

        if (_get(output, 'GoogleAssistant.LinkOutSuggestion')) {
            _set(googleAction.$response, 'richResponse.linkOutSuggestion', {
                destinationName: _get(output, 'GoogleAssistant.LinkOutSuggestion.destinationName'),
                url: _get(output, 'GoogleAssistant.LinkOutSuggestion.url'),
            });
        }

        if (_get(output, 'GoogleAssistant.Carousel')) {
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
                    carouselSelect: _get(output, 'GoogleAssistant.Carousel'),
                }
            });
        }

        if (_get(output, 'GoogleAssistant.List')) {
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
                    listSelect: _get(output, 'GoogleAssistant.List'),
                }
            });
        }

        if (_get(output, 'GoogleAssistant.CarouselBrowse')) {
            const richResponseItems = _get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                carouselBrowse: _get(output, 'GoogleAssistant.CarouselBrowse')
            });
        }

        if (_get(output, 'GoogleAssistant.Table')) {
            const richResponseItems = _get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                tableCard: _get(output, 'GoogleAssistant.Table')
            });
        }
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }
}
