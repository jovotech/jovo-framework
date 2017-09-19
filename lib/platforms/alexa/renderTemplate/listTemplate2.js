'use strict';

const ListTemplate1 = require('./listTemplate1').ListTemplate1;

/**
 * Class ListTemplate2
 */
class ListTemplate2 extends ListTemplate1 {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate2'
     */
    constructor() {
        super();
        this.type = 'ListTemplate2';
        this.listItems = [];
    }

}

module.exports.ListTemplate2 = ListTemplate2;
