'use strict';

const TemplateBuilder = require('./renderTemplateBuilder').RenderTemplateBuilder;

/**
 * Class ListTemplate1Builder
 */
class ListTemplate1Builder extends TemplateBuilder {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate1'
     */
    constructor() {
        super();
        this.template.type = 'ListTemplate1';
        this.template.listItems = [];
    }

    /**
     * Adds item to list
     * @param {string} token
     * @param {*} image
     * @param {*} primaryText
     * @param {*}secondaryText
     * @param {*}tertiaryText
     * @return {ListTemplate1Builder}
     */
    addItem(token, image, primaryText, secondaryText, tertiaryText) {
        let item = {
            token: token,
            image: TemplateBuilder.makeImage(image),
            textContent: TemplateBuilder.makeTextContent(
                primaryText,
                secondaryText,
                tertiaryText
            ),
        };
        this.template.listItems.push(item);
        return this;
    }

    /**
     * Sets items
     * @param {array} items
     * @return {ListTemplate1Builder}
     */
    setItems(items) {
        this.template.listItems = items;
        return this;
    }
}

module.exports.ListTemplate1Builder = ListTemplate1Builder;
