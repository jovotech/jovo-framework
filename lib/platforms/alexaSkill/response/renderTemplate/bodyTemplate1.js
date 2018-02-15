'use strict';

const Template = require('./template').Template;

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate1 extends Template {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate1';
    }

    /**
     * Sets textContent object
     * @param {{}} primaryText
     * @param {{}} secondaryText
     * @param {{}} tertiaryText
     * @return {BodyTemplate1Builder}
     */
    setTextContent(primaryText, secondaryText, tertiaryText) {
        this.textContent = Template.makeTextContent(
            primaryText,
            secondaryText,
            tertiaryText
        );
        return this;
    }
}

module.exports.BodyTemplate1 = BodyTemplate1;
