import _merge = require('lodash.merge');


export interface BasicCardImage {
    url: string;
    accessibilityText: string;
    width?: number;
    height?: number;
}

export interface BasicCardButton {
    title: string;
    openUrlAction: {
        url: string;
    };
}
/**
 * Basic card UI element
 */
export class BasicCard {

    title?: string;
    subtitle?: string;
    formattedText?: string;
    image?: BasicCardImage;
    buttons?: BasicCardButton[];
    imageDisplayOptions?: string;

    /**
     * Constructor
     * @param {BasicCard=} basicCard
     */
    constructor(basicCard?: BasicCard) {
       if (basicCard) {
           _merge(this, basicCard);
       }
    }

    /**
     * Sets title of item
     * @param {string} title
     * @return {BasicCard}
     */
    setTitle(title: string) {
        this.title = title;
        return this;
    }

    /**
     * Sets subtitle of item
     * @param {string} subtitle
     * @return {BasicCard}
     */
    setSubtitle(subtitle: string) {
        this.subtitle = subtitle;
        return this;
    }

    /**
     * Sets body text of item
     * @param {string} formattedText
     * @return {BasicCard}
     */
    setFormattedText(formattedText: string) {
        this.formattedText = formattedText;
        return this;
    }

    /**
     * Sets image of element
     * @param {BasicCardImage} image
     * @return {OptionItem}
     */
    setImage(image: BasicCardImage) {
        this.image = image;
        return this;
    }

    /**
     * Adds button to basic card
     * @param {string} text
     * @param {string} url
     * @return {BasicCard}
     */
    addButton(text: string, url: string) {
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

    /**
     * Sets the image display option
     * @param {string} imageDisplayOptions display option
     * @return {BasicCard}
     */
    setImageDisplay(imageDisplayOptions = 'DEFAULT') {

        if (['DEFAULT', 'WHITE', 'CROPPED'].indexOf(imageDisplayOptions) === -1) {
            throw new Error('Image Display Option must be one of DEFAULT, WHITE, CROPPED');
        }
        this.imageDisplayOptions = imageDisplayOptions;
        return this;
    }


}
