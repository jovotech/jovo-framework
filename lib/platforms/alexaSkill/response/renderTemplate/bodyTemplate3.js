'use strict';
const BodyTemplate2 = require('./bodyTemplate2').BodyTemplate2;


/* eslint-disable */
/**
 * BodyTemplate3 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate3 // eslint-disable-line
 */
class BodyTemplate3 extends BodyTemplate2 {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate3'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate3';
    }

    /**
     * Sets image on the left side
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setLeftImage(image, description) {
        return this.setImage(image, description);
    }
}

module.exports.BodyTemplate3 = BodyTemplate3;
