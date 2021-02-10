"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
/**
 * Template base class
 */
class Template {
    /**
     * Constructor
     */
    constructor(type) {
        this.backButton = Template.VISIBILITY_HIDDEN;
        this.type = type;
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
        const validTypes = [Template.VISIBILITY_HIDDEN, Template.VISIBILITY_VISIBLE];
        if (!validTypes.includes(visibility)) {
            throw new Error('Invalid visibility type');
        }
        this.backButton = visibility;
        return this;
    }
    /**
     * Sets back button to visible
     * @return {this}
     */
    showBackButton() {
        this.backButton = Template.VISIBILITY_VISIBLE;
        return this;
    }
    /**
     * Sets back button to hidden
     * @return {this}
     */
    hideBackButton() {
        this.backButton = Template.VISIBILITY_HIDDEN;
        return this;
    }
    /**
     * Sets background Image
     * @param {*|string} backgroundImage
     * @return {Template}
     */
    setBackgroundImage(backgroundImage, description) {
        this.backgroundImage = Template.makeImage(backgroundImage, description);
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
        const textContent = {
            primaryText: typeof primaryText === 'string' ? Template.makeRichText(primaryText) : primaryText,
        };
        if (secondaryText) {
            textContent.secondaryText =
                typeof secondaryText === 'string' ? Template.makeRichText(secondaryText) : secondaryText;
        }
        if (tertiaryText) {
            textContent.tertiaryText =
                typeof tertiaryText === 'string' ? Template.makeRichText(tertiaryText) : tertiaryText;
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
                type: 'RichText',
                text,
            };
        }
        return text;
    }
    /**
     * Creates plain text object
     * @param {string} text
     * @return {*}
     */
    static makePlainText(text) {
        if (typeof text === 'string') {
            return {
                type: 'PlainText',
                text,
            };
        }
        return text;
    }
    /**
     * Creates image object
     * @param {*} image
     * @param {string} description
     * @return {*}
     */
    static makeImage(image, description) {
        if (typeof image === 'string') {
            const img = {
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
        }
        else {
            if (_get(image, 'url')) {
                return Template.makeImage(_get(image, 'url'), _get(image, 'description'));
            }
            else {
                return image;
            }
        }
    }
}
exports.Template = Template;
Template.VISIBILITY_HIDDEN = 'HIDDEN';
Template.VISIBILITY_VISIBLE = 'VISIBLE';
//# sourceMappingURL=Template.js.map