'use strict';

const ListTemplate1Builder = require('./listTemplate1Builder').ListTemplate1Builder;

/**
 * Class ListTemplate2Builder
 */
class ListTemplate2Builder extends ListTemplate1Builder {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate2'
     */
    constructor() {
        super();
        this.template.type = 'ListTemplate2';
        this.template.listItems = [];
    }

}

module.exports.ListTemplate2Builder = ListTemplate2Builder;
