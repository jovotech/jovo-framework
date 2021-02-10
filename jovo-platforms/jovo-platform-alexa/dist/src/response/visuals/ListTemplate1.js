"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
/* eslint-disable */
/**
 * BodyTemplate1 implementation
 * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#bodytemplate1 // eslint-disable-line
 */
class ListTemplate1 extends Template_1.Template {
    /**
     * Constructor
     * Sets type of template to 'BodyTemplate1'
     */
    constructor() {
        super('ListTemplate1');
        /* eslint-enable */
        this.listItems = [];
        this.itemImageRequired = false;
    }
    addItem(tokenOrListItem, image, primaryText, secondaryText, tertiaryText) {
        if (typeof tokenOrListItem === 'string') {
            if (!image && this.itemImageRequired) {
                throw new Error('Image is needed');
            }
            if (!primaryText) {
                throw new Error('At least primaryText is needed');
            }
            const listItem = {
                token: tokenOrListItem,
                textContent: Template_1.Template.makeTextContent(primaryText, secondaryText, tertiaryText),
            };
            if (image) {
                listItem.image = Template_1.Template.makeImage(image);
            }
            this.listItems.push(listItem);
        }
        else {
            if (!tokenOrListItem.image && this.itemImageRequired) {
                throw new Error('Image is needed');
            }
            this.listItems.push(tokenOrListItem);
        }
        return this;
    }
    /**
     * Sets items
     * @param {array} items
     * @return {ListTemplate1}
     */
    setItems(items) {
        this.listItems = items;
        return this;
    }
}
exports.ListTemplate1 = ListTemplate1;
//# sourceMappingURL=ListTemplate1.js.map