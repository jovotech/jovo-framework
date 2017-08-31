'use strict';

/**
 * RenderTemplate base class
 */
class RenderTemplateBuilder {

    /**
     * Constructor
     */
    constructor() {
        this.template = {};
    }

    /**
     * Sets title of template
     * @param {string} title
     * @return {RenderTemplateBuilder}
     */
    setTitle(title) {
        this.template.title = title;
        return this;
    }

    /**
     * Sets token of template
     * @param {string} token
     * @return {RenderTemplateBuilder}
     */
    setToken(token) {
        this.template.token = token;
        return this;
    }

    /**
     * Sets back-button visibility
     * @param {'HIDDEN'|'VISIBLE'} visibility
     * @return {RenderTemplateBuilder}
     */
    setBackButton(visibility) {
        let validTypes = ['VISIBLE', 'HIDDEN'];

        if (validTypes.indexOf(visibility) === -1) {
            throw new Error('Invalid visibility type');
        }

        this.template.backButton = visibility;
        return this;
    }

    /**
     * Sets background Image
     * @param {*|string} backgroundImage
     * @return {RenderTemplateBuilder}
     */
    setBackgroundImage(backgroundImage) {
        this.template.backgroundImage = RenderTemplateBuilder.makeImage(backgroundImage);
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

       textContent.primaryText = RenderTemplateBuilder.makeRichText(primaryText);

        if (secondaryText) {
                textContent.secondaryText = RenderTemplateBuilder.makeRichText(secondaryText);
        }
        if (tertiaryText) {
                textContent.tertiaryText = RenderTemplateBuilder.makeRichText(tertiaryText);
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
                return RenderTemplateBuilder.makeImage(image.url, image.description);
            } else {
                return RenderTemplateBuilder.makeImage(image.url);
            }
        } else {
            return image;
        }
    }

    /**
     * Builds template object
     * @return {{}|*}
     */
    build() {
        return this.template;
    }
}


module.exports.RenderTemplateBuilder = RenderTemplateBuilder;
