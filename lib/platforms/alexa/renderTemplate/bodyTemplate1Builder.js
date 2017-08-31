'use strict';

const TemplateBuilder = require('./renderTemplateBuilder').RenderTemplateBuilder;

/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate1Builder extends TemplateBuilder {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.template.type = 'BodyTemplate1';
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

module.exports.BodyTemplate1Builder = BodyTemplate1Builder;
