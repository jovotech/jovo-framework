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
        return this.setText(formattedText);
    }
    setText(text) {
        this.text = text;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }
    addButton(text, url, hint = 'LINK_UNSPECIFIED') {
        this.button = {
            name: text,
            open: {
                hint,
                url,
            },
        };
        return this;
    }
    setImageDisplay(imageDisplayOptions = 'UNSPECIFIED') {
        return this.setImageFill(imageDisplayOptions);
    }
    setImageFill(imageFill = 'UNSPECIFIED') {
        if (!['DEFAULT', 'WHITE', 'CROPPED'].includes(imageFill)) {
            throw new Error('Image Display Option must be one of DEFAULT, WHITE, CROPPED');
        }
        this.imageFill = imageFill;
        return this;
    }
}
exports.BasicCard = BasicCard;
//# sourceMappingURL=BasicCard.js.map