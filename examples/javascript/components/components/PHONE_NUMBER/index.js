const {Component} = require('jovo-framework');

class PHONE_NUMBER extends Component {
    constructor(config) {
        super(config);
        this.handler = require('./src/handler');
        this.config = require('./src/config');
        this.pathToI18n = './src/i18n/';
    }
}

module.exports = PHONE_NUMBER;