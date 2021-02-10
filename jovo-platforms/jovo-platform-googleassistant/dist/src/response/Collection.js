"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection {
    constructor(items) {
        this.items = [];
        if (items) {
            this.items = items;
        }
    }
    addItem(item) {
        this.items.push(item);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map