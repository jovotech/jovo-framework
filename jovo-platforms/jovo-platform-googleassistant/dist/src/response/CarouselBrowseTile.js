"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionItem_1 = require("./CollectionItem");
class CarouselBrowseTile extends CollectionItem_1.CollectionItem {
    constructor(item) {
        super(item);
        this.openUrlAction = {
            urlTypeHint: 'URL_TYPE_HINT_UNSPECIFIED',
        };
        if (item) {
            if (item.title) {
                this.footer = item.footer;
            }
            if (item.openUrlAction) {
                if (item.openUrlAction.url) {
                    this.openUrlAction.url = item.openUrlAction.url;
                }
                if (item.openUrlAction.urlTypeHint) {
                    this.openUrlAction.urlTypeHint = item.openUrlAction.urlTypeHint;
                }
            }
        }
    }
    setFooter(footer) {
        if (!footer) {
            throw new Error('footer cannot be empty');
        }
        this.footer = footer;
        return this;
    }
    setOpenUrlAction(openUrlAction) {
        this.openUrlAction = openUrlAction;
        return this;
    }
    setUrlTypeHint(urlTypeHint) {
        if (CarouselBrowseTile.urlTypeHints.includes(urlTypeHint)) {
            throw new Error('Valid type hints are: ' + CarouselBrowseTile.urlTypeHints.join(', '));
        }
        this.openUrlAction.urlTypeHint = urlTypeHint;
    }
}
exports.CarouselBrowseTile = CarouselBrowseTile;
CarouselBrowseTile.urlTypeHints = ['URL_TYPE_HINT_UNSPECIFIED', 'AMP_CONTENT'];
//# sourceMappingURL=CarouselBrowseTile.js.map