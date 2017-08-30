'use strict';

const TemplateBuilder = require('./renderTemplateBuilder').RenderTemplateBuilder;

/* eslint-disable */
/**
 * BodyTemplate2 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate2 // eslint-disable-line
 */
class BodyTemplate2Builder extends TemplateBuilder {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.template.type = 'BodyTemplate2';
    }

    /**
     * Sets image main image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2Builder}
     */
    setImage(image, description) {
        this.template.image = TemplateBuilder.makeImage(image, description);
        return this;
    }

    /**
     * Sets image on the right side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2Builder}
     */
    setRightImage(image, description) {
        return this.setImage(image, description);
    }

    /**
     * Sets textContent object
     * @param {{}} primaryText
     * @param {{}} secondaryText
     * @param {{}} tertiaryText
     * @return {BodyTemplate1Builder}
     */
    setTextContent(primaryText, secondaryText, tertiaryText) {
        this.template.textContent = TemplateBuilder.makeTextContent(
            primaryText,
            secondaryText,
            tertiaryText
        );
        return this;
    }
}

module.exports.BodyTemplate2Builder = BodyTemplate2Builder;
