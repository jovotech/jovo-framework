'use strict';

/**
 * Template base class
 */
class Template {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Sets title of template
     * @param {string} title
     * @return {Template}
     */
    setTitle(title) {
        this.title = title;
        return this;
    }

    /**
     * Sets token of template
     * @param {string} token
     * @return {Template}
     */
    setToken(token) {
        this.token = token;
        return this;
    }

    /**
     * Sets back-button visibility
     * @param {'HIDDEN'|'VISIBLE'} visibility
     * @return {Template}
     */
    setBackButton(visibility) {
        let validTypes = ['VISIBLE', 'HIDDEN'];

        if (validTypes.indexOf(visibility) === -1) {
            throw new Error('Invalid visibility type');
        }

        this.backButton = visibility;
        return this;
    }

    /**
     * Sets background Image
     * @param {*|string} backgroundImage
     * @return {Template}
     */
    setBackgroundImage(backgroundImage) {
        this.backgroundImage = Template.makeImage(backgroundImage);
        return this;
    }

    /**
     * Creates textContent object
     * @param {*} primaryText
     * @param {*} secondaryText
     * @param {*} tertiaryText
     * @return {{}}
     */
    static makeTextContent(primaryText, secondaryText, tertiaryText) {
        let textContent = {};

       textContent.primaryText = Template.makeRichText(primaryText);

        if (secondaryText) {
                textContent.secondaryText = Template.makeRichText(secondaryText);
        }
        if (tertiaryText) {
                textContent.tertiaryText = Template.makeRichText(tertiaryText);
        }

        return textContent;
    }

    /**
     * Creates rich text object
     * @param {string} text
     * @return {{text: *, type: string}}
     */
    static makeRichText(text) {
        if (typeof text === 'string') {
            return {
                text: text,
                type: 'RichText',
            };
        } else if (text.text && text.type) {
            return text;
        }
    }

    /**
     * Creates plain text object
     * @param {string} text
     * @return {*}
     */
    static makePlainText(text) {
        if (typeof text === 'string') {
            return {
                text: text,
                type: 'PlainText',
            };
        } else if (text.text && text.type) {
            return text;
        }
    }

    /**
     * Creates image object
     * @param {*} image
     * @param {string} description
     * @return {*}
     */
    static makeImage(image, description) {
        if (typeof image === 'string') {
            let img = {
                sources: [
                    {
                        url: image,
                    },
                ],
            };

            if (description) {
                img.contentDescription = description;
            }
            return img;
        } else if (image && image.url) {
            if (image.description) {
                return Template.makeImage(image.url, image.description);
            } else {
                return Template.makeImage(image.url);
            }
        } else {
            return image;
        }
    }

    /**
     * Builds template object
     * @deprecated
     * @return {{}|*}
     */
    build() {
        return this;
    }
}


module.exports.Template = Template;
