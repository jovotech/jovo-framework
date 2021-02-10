"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionItem {
    constructor(item) {
        if (item) {
            if (item.title) {
                this.title = item.title;
            }
            if (item.description) {
                this.description = item.description;
            }
            if (item.image) {
                this.image = item.image;
            }
        }
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }
}
exports.CollectionItem = CollectionItem;
//# sourceMappingURL=CollectionItem.js.map