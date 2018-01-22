'use strict';

const ListTemplate1 = require('./listTemplate1').ListTemplate1;

/**
 * Class ListTemplate3
 */
class ListTemplate3 extends ListTemplate1 {

    /**
     * Constructor
     * Sets type of template to 'ListTemplate2'
     */
    constructor() {
        super();
        this.type = 'ListTemplate3';
        this.listItems = [];
    }

}

module.exports.ListTemplate3 = ListTemplate3;
