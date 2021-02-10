"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListTemplate1_1 = require("./ListTemplate1");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class ListTemplate2 extends ListTemplate1_1.ListTemplate1 {
    /* eslint-enable */
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super();
        this.type = 'ListTemplate2';
        // In ListTemplate1 item images are optional, but in ListTemplate2 they are required
        this.itemImageRequired = true;
    }
}
exports.ListTemplate2 = ListTemplate2;
//# sourceMappingURL=ListTemplate2.js.map