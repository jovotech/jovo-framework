'use strict';
const BodyTemplate6 = require('./bodyTemplate6').BodyTemplate6;


/* eslint-disable */
/**
 * BodyTemplate7 implementation
 * @see https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate7-syntax // eslint-disable-line
 */
class BodyTemplate7 extends BodyTemplate6 {
/* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate7'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate7';
    }
}

module.exports.BodyTemplate7 = BodyTemplate7;
