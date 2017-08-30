'use strict';

const BodyTemplate2Builder = require('./bodyTemplate2Builder').BodyTemplate2Builder;

/* eslint-disable */
/**
 * BodyTemplate3 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate3 // eslint-disable-line
 */
class BodyTemplate3Builder extends BodyTemplate2Builder {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate3'
     */
    constructor() {
        super();
        this.template.type = 'BodyTemplate3';
    }

    /**
     * Sets image on the left side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2Builder}
     */
    setLeftImage(image, description) {
        return this.setImage(image, description);
    }
}

module.exports.BodyTemplate3Builder = BodyTemplate3Builder;
