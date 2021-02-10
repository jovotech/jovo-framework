"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BodyTemplate1_1 = require("./BodyTemplate1");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class BodyTemplate6 extends BodyTemplate1_1.BodyTemplate1 {
    /* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'BodyTemplate6';
    }
    /**
     * Sets full screen image
     * @param {*} image
     * @param {string} description
     * @return {BodyTemplate6}
     */
    setFullScreenImage(image, description) {
        return this.setBackgroundImage(image, description);
    }
}
exports.BodyTemplate6 = BodyTemplate6;
//# sourceMappingURL=BodyTemplate6.js.map