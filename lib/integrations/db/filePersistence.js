'use strict';
const fs = require('fs');
const ERR_MAIN_KEY_NOT_FOUND = 'ERR_MAIN_KEY_NOT_FOUND';
const ERR_DATA_KEY_NOT_FOUND = 'ERR_DATA_KEY_NOT_FOUND';
/**
 * Class FilePersistence
 * @deprecated
 */
class FilePersistence {
    /**
     * constructor
     * @param {string} filename
     */
    constructor(filename) {
        if ((/[^a-z0-9_-]/gi).test(filename)) {
            throw Error('Filename not valid');
        }

        if (!filename) {
            filename = 'db';
        }

        this.filename = './db/'+filename+'.json';
    }
    /**
     * Sets mainkey (userId)
     * @param {string} mainKey
     * @return {FilePersistence}
     */
    setMainKey(mainKey) {
        this.mainKey = mainKey;
        return this;
    }
    /**
     * Saves value
     * @param {string} key
     * @param {object|string} value
     * @param {function} callback
     */
    save(key, value, callback) {
        let filename = this.filename;
        if (!fs.existsSync('./db')) {
            fs.mkdirSync('./db');
        }
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '{}');
        }

        let mainKey = this.mainKey;

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            let fileObj = data.length > 0 ? JSON.parse(data) : {};
            if (!fileObj[mainKey]) {
                fileObj[mainKey] = {};
            }
            fileObj[mainKey][key] = value;
            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                callback(err);
            });
        });
    }

    /**
     * Gets value from db
     * @param {string} key
     * @param {function} callback
     */
    load(key, callback) {
        let mainKey = this.mainKey;

        let filename = this.filename;
        if (!fs.existsSync('./db')) {
            fs.mkdirSync('./db');
        }
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '{}');
        }
        fs.readFile(this.filename, 'utf8', function(err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            if (!fileObj[mainKey]) {
                callback(createMainKeyNotFoundError(mainKey), null);
                return;
            }

            if (typeof fileObj[mainKey][key] === 'undefined') {
                callback(createDataKeyNotFoundError(mainKey, key), null);
                return;
            }

            callback(err, fileObj[mainKey][key]);
        });
    }

    /**
     * Deletes all data of the user
     * @param {function} callback
     */
    deleteUser(callback) {
        let mainKey = this.mainKey;
        let filename = this.filename;
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                callback(err, false);
                return;
            }
            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            if (!fileObj[mainKey]) {
                callback(createMainKeyNotFoundError(mainKey), null);
                return;
            }
            delete fileObj[mainKey];

            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                if (err) {
                    callback(err, false);
                    return;
                }
                callback(err, true);
            });
        });
    }

    /**
     * Deletes data for that key
     * @param {string} key
     * @param {function} callback
     */
    deleteData(key, callback) {
        let mainKey = this.mainKey;
        let filename = this.filename;
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                callback(err, false);
                return;
            }

            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            if (!fileObj[mainKey]) {
                callback(createMainKeyNotFoundError(mainKey), null);
                return;
            }

            if (typeof fileObj[mainKey][key] === 'undefined') {
                callback(createDataKeyNotFoundError(mainKey, key), null);
                return;
            }

            delete fileObj[mainKey][key];

            fs.writeFile(filename, JSON.stringify(fileObj, null, '\t'), function(err) {
                if (err) {
                    callback(err, false);
                    return;
                }
                callback(err, true);
            });
        });
    }

}

/**
 * Data key not found error
 * @param {string} mainKey
 * @param {string} key
 * @return {Error}
 */
function createDataKeyNotFoundError(mainKey, key) {
    let err = new Error('Data key "'+key+'" not found for main key "'+mainKey+'"');
    err.code = ERR_DATA_KEY_NOT_FOUND;
    return err;
}
/**
 * Main key not found error
 * @param {string} mainKey
 * @return {Error}
 */
function createMainKeyNotFoundError(mainKey) {
    let err = new Error('Mainkey "'+mainKey+'" not found in database');
    err.code = ERR_MAIN_KEY_NOT_FOUND;
    return err;
}
module.exports.FilePersistence = FilePersistence;
module.exports.FilePersistence.ERR_MAIN_KEY_NOT_FOUND = ERR_MAIN_KEY_NOT_FOUND;
module.exports.FilePersistence.ERR_DATA_KEY_NOT_FOUND = ERR_DATA_KEY_NOT_FOUND;
