"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CarouselItem_1 = require("./CarouselItem");
class OptionItem extends CarouselItem_1.CarouselItem {
    constructor(item) {
        super(item);
        this.optionInfo = {
            key: '',
            synonyms: [],
        };
        this.optionInfo = {
            key: '',
            synonyms: [],
        };
        if (item) {
            if (item.optionInfo) {
                this.optionInfo = item.optionInfo;
            }
        }
    }
    setKey(key) {
        this.optionInfo.key = key;
        return this;
    }
    addSynonym(synonym) {
        this.optionInfo.synonyms.push(synonym);
        return this;
    }
}
exports.OptionItem = OptionItem;
//# sourceMappingURL=OptionItem.js.map