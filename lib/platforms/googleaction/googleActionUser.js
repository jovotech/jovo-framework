'use strict';
const User = require('./../../user').User;

/**
 * Class GoogleActionUser
 */
class GoogleActionUser extends User {
    /**
     * Constructor
     * @param {Platform} platform
     * @param {*} config
     */
    constructor(platform, config) {
        super(platform, config);
    }
}

module.exports.GoogleActionUser = GoogleActionUser;
