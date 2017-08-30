'use strict';

const BodyTemplate2Builder = require('./bodyTemplate2Builder').BodyTemplate2Builder;

/* eslint-disable */
/**
 * BodyTemplate6 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate6 // eslint-disable-line
 */
class BodyTemplate6Builder extends BodyTemplate2Builder {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate6'
     */
    constructor() {
        super();
        this.template.type = 'BodyTemplate6';
    }

    /**
     * Sets full screen image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2Builder}
     */
    setFullScreenImage(image, description) {
        return this.setImage(image, description);
    }
}

module.exports.BodyTemplate6Builder = BodyTemplate6Builder;
