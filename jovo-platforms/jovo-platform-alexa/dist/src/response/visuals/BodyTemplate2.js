"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
const BodyTemplate1_1 = require("./BodyTemplate1");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate2 extends BodyTemplate1_1.BodyTemplate1 {
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
        this.image = Template_1.Template.makeImage(image, description);
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
}
exports.BodyTemplate2 = BodyTemplate2;
//# sourceMappingURL=BodyTemplate2.js.map