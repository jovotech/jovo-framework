"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
const index_1 = require("../index");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
class Cards {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.showBasicCard = function (basicCard) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.card = {
                BasicCard: basicCard,
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showSuggestionChips = function (chips) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.SuggestionChips = chips;
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showLinkOutSuggestion = function (destinationName, url) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.LinkOutSuggestion = {
                destinationName,
                url,
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showCarousel = function (carousel) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.Carousel = carousel;
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showCarouselBrowse = function (carouselBrowse) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.CarouselBrowse = carouselBrowse;
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showSimpleTable = function (title, subtitle, columnHeaders, rowsText) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.Table = new index_1.Table()
                .setTitle(title)
                .setSubtitle(subtitle)
                .addColumns(columnHeaders)
                .addRows(rowsText);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showTable = function (table) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.Table = table;
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showList = function (list) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.List = list;
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.getSelectedElementId = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'OPTION') {
                    return _get(argument, 'textValue');
                }
            }
        };
    }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.OPTION') {
            googleAction.$type.type = jovo_core_1.EnumRequestType.ON_ELEMENT_SELECTED;
            for (const argument of _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'OPTION') {
                    _set(googleAction.$type, 'subType', _get(argument, 'textValue'));
                }
            }
        }
    }
    output(googleAction) {
        if (!googleAction.hasScreenInterface()) {
            return;
        }
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        const output = googleAction.$output;
        const cardSimpleCard = _get(output, 'GoogleAssistant.card.SimpleCard') || _get(output, 'card.SimpleCard');
        if (cardSimpleCard) {
            const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new index_1.BasicCard()
                    .setTitle(_get(cardSimpleCard, 'title'))
                    .setFormattedText(_get(cardSimpleCard, 'content')),
            });
            _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
        }
        const cardImageCard = _get(output, 'GoogleAssistant.card.ImageCard') || _get(output, 'card.ImageCard');
        if (cardImageCard) {
            const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            richResponseItems.push({
                basicCard: new index_1.BasicCard()
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
                    'optContext': _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech')) || '',
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
        const suggestionChips = _get(output, 'GoogleAssistant.SuggestionChips');
        const quickReplies = output.quickReplies;
        if ((suggestionChips === null || suggestionChips === void 0 ? void 0 : suggestionChips.length) || (quickReplies === null || quickReplies === void 0 ? void 0 : quickReplies.length)) {
            const newSuggestionChips = _get(googleAction.$originalResponse, 'richResponse.suggestions', []);
            const suggestionChipsToAdd = (suggestionChips === null || suggestionChips === void 0 ? void 0 : suggestionChips.length) ? suggestionChips.map((chip) => ({ title: chip }))
                : quickReplies.map((quickReply) => ({
                    title: typeof quickReply !== 'string' ? quickReply.value : quickReply,
                }));
            newSuggestionChips.push(...suggestionChipsToAdd);
            _set(googleAction.$originalResponse, 'richResponse.suggestions', newSuggestionChips);
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
    uninstall(googleAssistant) { }
}
exports.Cards = Cards;
//# sourceMappingURL=Cards.js.map