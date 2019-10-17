const {ComponentPlugin} = require('jovo-framework');

const componentConfig = require('./src/config');
const componentHandler = require('./src/handler');

class GetPhoneNumber extends ComponentPlugin {
    constructor(config) {
        super(config);
        this.handler = componentHandler;
        this.config = componentConfig;
        this.pathToI18n = './src/i18n/';
    }
}

module.exports = GetPhoneNumber;