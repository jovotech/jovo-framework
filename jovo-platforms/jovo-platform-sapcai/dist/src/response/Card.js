"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicCard_1 = require("./BasicCard");
class CardContent {
}
exports.CardContent = CardContent;
class Card extends BasicCard_1.BasicCard {
    constructor(content) {
        super('card');
        this.content = content;
    }
}
exports.Card = Card;
//# sourceMappingURL=Card.js.map