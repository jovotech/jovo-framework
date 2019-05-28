import {PlainText, RichText, Template, TextContent} from './Template';

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export class BodyTemplate1 extends Template {
/* eslint-enable */

    textContent?: TextContent;

    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super('BodyTemplate1');
    }


    /**
     *
     * @param {string | RichText | PlainText} primaryText
     * @param {string | RichText | PlainText} secondaryText
     * @param {string | RichText | PlainText} tertiaryText
     * @returns {this}
     */
    setTextContent(primaryText: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText) {
        this.textContent = Template.makeTextContent(
            primaryText,
            secondaryText,
            tertiaryText
        );
        return this;
    }
}

