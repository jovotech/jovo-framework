import { PlainText, RichText, Template, TextContent } from './Template';
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
export declare class BodyTemplate1 extends Template {
    textContent?: TextContent;
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor();
    /**
     *
     * @param {string | RichText | PlainText} primaryText
     * @param {string | RichText | PlainText} secondaryText
     * @param {string | RichText | PlainText} tertiaryText
     * @returns {this}
     */
    setTextContent(primaryText: string | RichText | PlainText, secondaryText?: string | RichText | PlainText, tertiaryText?: string | RichText | PlainText): this;
}
