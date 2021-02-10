"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicCard_1 = require("./BasicCard");
class Carousel extends BasicCard_1.BasicCard {
    constructor(items) {
        super('carousel');
        this.content = items;
    }
}
exports.Carousel = Carousel;
//# sourceMappingURL=Carousel.js.map