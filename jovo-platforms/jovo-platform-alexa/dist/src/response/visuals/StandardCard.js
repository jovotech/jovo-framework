"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("./Card");
class StandardCard extends Card_1.Card {
    constructor(standardCard) {
        super('Standard');
        this.image = {};
        if (standardCard) {
            Object.assign(this, {}, standardCard);
        }
    }
    /**
     * Sets title of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} title
     * @return {*}
     */
    setTitle(title) {
        this.title = title;
        return this;
    }
    /**
     * Sets content of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} text
     * @return {*}
     */
    setText(text) {
        this.text = text;
        return this;
    }
    /**
     * Sets content of card
     * Total number of characters (title and content combined) cannot exceed 8000
     * @param {string} image
     * @return {*}
     */
    setImage(image) {
        this.image = image;
        return this;
    }
    setSmallImageUrl(url) {
        this.image.smallImageUrl = url;
        return this;
    }
    setLargeImageUrl(url) {
        this.image.largeImageUrl = url;
        return this;
    }
}
exports.StandardCard = StandardCard;
//# sourceMappingURL=StandardCard.js.map