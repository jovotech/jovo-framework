"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicCard_1 = require("./BasicCard");
class ListContent {
    constructor(elements, buttons) {
        this.elements = elements;
        this.buttons = buttons;
    }
}
exports.ListContent = ListContent;
class List extends BasicCard_1.BasicCard {
    constructor(content) {
        super('list');
        this.content = content;
    }
}
exports.List = List;
//# sourceMappingURL=List.js.map