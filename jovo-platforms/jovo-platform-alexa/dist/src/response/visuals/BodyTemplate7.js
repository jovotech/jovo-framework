"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
const BodyTemplate6_1 = require("./BodyTemplate6");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate7 extends BodyTemplate6_1.BodyTemplate6 {
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate7';
    }
    /**
     * Sets image main image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate2}
     */
    setImage(image, description) {
        this.image = Template_1.Template.makeImage(image, description);
        return this;
    }
}
exports.BodyTemplate7 = BodyTemplate7;
//# sourceMappingURL=BodyTemplate7.js.map