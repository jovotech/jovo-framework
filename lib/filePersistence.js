const fs = require('fs');

/**
 * Class FilePersistence
 */
class FilePersistence {
    /**
     * constructor
     */
    constructor() {
        this.filename = './db/db.json';
    }
    /**
     * Sets mainkey (userId)
     * @param {string} mainKey
     */
    setMainKey(mainKey) {
        this.mainKey = mainKey;
    }
    /**
     * Saves value
     * @param {string} key
     * @param {object|string} value
     * @param {function} callback
     */
    dbSave(key, value, callback) {
        if (!fs.existsSync('./db')) {
            fs.mkdirSync('./db');
        }

        let mainKey = this.mainKey;
        let filename = this.filename;
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                // TODO error handling
            }

            let fileObj = data.length > 0 ? JSON.parse(data) : {};
            if (!fileObj[mainKey]) {
                fileObj[mainKey] = {};
            }
            fileObj[mainKey][key] = value;

            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                if (err) {
                    return console.log(err);
                }
                callback(err);
            });
        });
    }

    /**
     * Gets value from db
     * @param {string} key
     * @param {function} callback
     */
    dbLoad(key, callback) {
        let mainKey = this.mainKey;

        fs.readFile(this.filename, 'utf8', function(err, data) {
            if (err) {
                // TODO error handling
            }

            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            callback(fileObj[mainKey][key], err);
        });
    }

    /**
     * Deletes all data of the user
     * @param {function} callback
     */
    dbDeleteUser(callback) {
        let mainKey = this.mainKey;
        let filename = this.filename;
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                // TODO error handling
            }

            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            delete fileObj[mainKey];

            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                if (err) {
                    return console.log(err);
                }
                callback(err);
            });
        });
    }

    /**
     * Deletes data for that key
     * @param {string} key
     * @param {function} callback
     */
    dbDeleteData(key, callback) {
        let mainKey = this.mainKey;
        let filename = this.filename;
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                // TODO error handling
            }

            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            delete fileObj[mainKey][key];

            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                if (err) {
                    return console.log(err);
                }
                callback(err);
            });
        });
    }

}

module.exports.FilePersistence = FilePersistence;

