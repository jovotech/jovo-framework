"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var _get = require("lodash.get");
var _set = require("lodash.set");
var Cards = /** @class */ (function () {
    function Cards() {
    }
    Cards.prototype.install = function (corePlatform) {
        corePlatform.middleware('$output').use(this.output.bind(this));
        __1.CorePlatformApp.prototype.showAdaptiveCard = function (options) {
            _set(this.$output, 'WebAssistant.AdaptiveCard', options);
            return this;
        };
        __1.CorePlatformApp.prototype.showSuggestionChips = function (chips) {
            if (!this.$output.WebAssistant) {
                this.$output.WebAssistant = {};
            }
            this.$output.WebAssistant.SuggestionChips = chips;
            return this;
        };
    };
    Cards.prototype.output = function (corePlatformApp) {
        var output = corePlatformApp.$output;
        if (!corePlatformApp.$response) {
            corePlatformApp.$response = new __1.CorePlatformResponse();
        }
        var suggestionChips = _get(output, 'WebAssistant.SuggestionChips');
        if (suggestionChips && suggestionChips.length > 0) {
            _set(corePlatformApp.$response, 'response.output.suggestionChips', suggestionChips);
        }
        var simpleCardOptions = _get(output, 'card.SimpleCard');
        if (simpleCardOptions) {
            _set(corePlatformApp.$response, 'response.output.card', new __1.AdaptiveCard({
                body: [
                    { type: 'TextBlock', text: simpleCardOptions.title, size: 'large' },
                    { type: 'TextBlock', text: simpleCardOptions.content },
                ],
            }));
        }
        var imageCardOptions = _get(output, 'card.ImageCard');
        if (imageCardOptions) {
            _set(corePlatformApp.$response, 'response.output.card', new __1.AdaptiveCard({
                body: [
                    { type: 'TextBlock', text: imageCardOptions.title, size: 'large' },
                    { type: 'Image', url: imageCardOptions.imageUrl },
                    { type: 'TextBlock', text: imageCardOptions.content },
                ],
            }));
        }
        var adaptiveCardOptions = _get(output, 'WebAssistant.AdaptiveCard') || _get(output, 'card.AdaptiveCard');
        if (adaptiveCardOptions) {
            _set(corePlatformApp.$response, 'response.output.card', new __1.AdaptiveCard(adaptiveCardOptions));
        }
        // TODO finish account linking card
        var accountLinkingCard = _get(output, 'card.AccountLinkingCard');
        if (accountLinkingCard) {
            _set(corePlatformApp.$response, 'response.output.card', new __1.AdaptiveCard({
                body: [],
            }));
        }
    };
    return Cards;
}());
exports.Cards = Cards;
