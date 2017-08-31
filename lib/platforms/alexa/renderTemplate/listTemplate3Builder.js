'use strict';

const ListTemplate1Builder = require('./listTemplate1Builder').ListTemplate1Builder;

/**
 * Class ListTemplate3Builder
 */
class ListTemplate3Builder extends ListTemplate1Builder {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate2'
     */
    constructor() {
        super();
        this.template.type = 'ListTemplate3';
        this.template.listItems = [];
    }

}

module.exports.ListTemplate3Builder = ListTemplate3Builder;
