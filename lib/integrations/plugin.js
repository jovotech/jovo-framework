'use strict';

/**
 * Plugin base class
 * @abstract
 */
class Plugin {

    /**
     * Constructors
     * @param {*} options
     */
    constructor(options) {
        this.options = options || {};
    }

    /**
     * Needs to be implemented
     * @abstract
     */
    init() {
    }

    /**
     * Sets app instance to plugin
     * @param {*} app
     */
    setApp(app) {
        this.app = app;
        this.init();
    }
}

module.exports.Plugin = Plugin;

