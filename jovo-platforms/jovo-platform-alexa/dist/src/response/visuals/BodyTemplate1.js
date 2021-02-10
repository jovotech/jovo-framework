"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate1 extends Template_1.Template {
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
    setTextContent(primaryText, secondaryText, tertiaryText) {
        this.textContent = Template_1.Template.makeTextContent(primaryText, secondaryText, tertiaryText);
        return this;
    }
}
exports.BodyTemplate1 = BodyTemplate1;
//# sourceMappingURL=BodyTemplate1.js.map