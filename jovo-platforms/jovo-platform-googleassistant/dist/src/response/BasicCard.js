"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
class BasicCard {
    constructor(basicCard) {
        if (basicCard) {
            _merge(this, basicCard);
        }
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
    }
    setFormattedText(formattedText) {
        this.formattedText = formattedText;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }
    addButton(text, url) {
        if (!this.buttons) {
            this.buttons = [];
        }
        this.buttons.push({
            title: text,
            openUrlAction: {
                url,
            },
        });
        return this;
    }
    setImageDisplay(imageDisplayOptions = 'DEFAULT') {
        if (['DEFAULT', 'WHITE', 'CROPPED'].indexOf(imageDisplayOptions) === -1) {
            throw new Error('Image Display Option must be one of DEFAULT, WHITE, CROPPED');
        }
        this.imageDisplayOptions = imageDisplayOptions;
        return this;
    }
}
exports.BasicCard = BasicCard;
//# sourceMappingURL=BasicCard.js.map