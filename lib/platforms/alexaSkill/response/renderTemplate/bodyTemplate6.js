'use strict';
const BodyTemplate2 = require('./bodyTemplate2').BodyTemplate2;


/* eslint-disable */
/**
 * BodyTemplate6 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate6 // eslint-disable-line
 */
class BodyTemplate6 extends BodyTemplate2 {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate6'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate6';
    }

    /**
     * Sets full screen image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setFullScreenImage(image, description) {
        return this.setBackgroundImage(image, description);
    }
}

module.exports.BodyTemplate6 = BodyTemplate6;
