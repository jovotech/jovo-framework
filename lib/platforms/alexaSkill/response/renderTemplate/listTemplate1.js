'use strict';

const Template = require('./template').Template;

/**
 * Class ListTemplate1
 */
class ListTemplate1 extends Template {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate1'
     */
    constructor() {
        super();
        this.type = 'ListTemplate1';
        this.listItems = [];
    }

    /**
     * Adds item to list
     * @param {string} token
     * @param {*} image
     * @param {*} primaryText
     * @param {*}secondaryText
     * @param {*}tertiaryText
     * @return {ListTemplate1}
     */
    addItem(token, image, primaryText, secondaryText, tertiaryText) {
        let item = {
            token: token,
            image: Template.makeImage(image),
            textContent: Template.makeTextContent(
                primaryText,
                secondaryText,
                tertiaryText
            ),
        };
        this.listItems.push(item);
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

module.exports.ListTemplate1 = ListTemplate1;
