"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("./Card");
class SimpleCard extends Card_1.Card {
    constructor(simpleCard) {
        super('Simple');
        if (simpleCard) {
            Object.assign(this, simpleCard);
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
     * @param {string} content
     * @return {*}
     */
    setContent(content) {
        this.content = content;
        return this;
    }
}
exports.SimpleCard = SimpleCard;
//# sourceMappingURL=SimpleCard.js.map