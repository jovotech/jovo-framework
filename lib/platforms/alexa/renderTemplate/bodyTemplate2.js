'use strict';

const Template = require('./template').Template;

/* eslint-disable */
/**
 * BodyTemplate2 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate2 // eslint-disable-line
 */
class BodyTemplate2 extends Template {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate2';
    }

    /**
     * Sets image main image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setImage(image, description) {
        this.image = Template.makeImage(image, description);
        return this;
    }

    /**
     * Sets image on the right side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setRightImage(image, description) {
        return this.setImage(image, description);
    }

    /**
     * Sets textContent object
     * @param {{}} primaryText
     * @param {{}} secondaryText
     * @param {{}} tertiaryText
     * @return {BodyTemplate1}
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

module.exports.BodyTemplate2 = BodyTemplate2;
