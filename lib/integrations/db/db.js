'use strict';
/**
 * DB Wrapper class
 */
class Db {
    /**
     * Constructor
     * @param {string} name name of database
     * @param {*} implementation Database implementation
     */
    constructor(name, implementation) {
        this.databases = {};
        this.databases[name] = implementation;
    }

    /**
     * Selects database by name
     * @param {string} mainKey
     * @param {string} name
     * @return {*}
     */
    use(mainKey, name) {
        if (!name) {
            return this.databases[Object.keys(this.databases)[0]]
                .setMainKey(mainKey);
        }
        return this.databases[name].setMainKey(mainKey);
    }

    /**
     * Adds another database implementation
     * @param {string} name name of database
     * @param {*} implementation Database implementation
     */
    addDb(name, implementation) {
        this.databases[name] = implementation;
    }
}

module.exports.Db = Db;
