'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const ERR_MAIN_KEY_NOT_FOUND = 'ERR_MAIN_KEY_NOT_FOUND';
const ERR_DATA_KEY_NOT_FOUND = 'ERR_DATA_KEY_NOT_FOUND';
/**
 * Class FilePersistence
 */
class FilePersistence {
    /**
     * constructor
     * @param {string} filename
     */
    constructor(filename) {
        // default db name is db
        if (!filename) {
            filename = 'db';
        }
        // put in project db folder if just filename
        if ((/^([a-z0-9_-])/gi).test(filename)) {
            filename = './db/' + filename;
        }

        // add .json file extension
        if (path.extname(filename) === '') {
            filename += '.json';
        }
        if ((/[^a-z0-9_/\.:\\-]/gi).test(filename)) {
            throw Error('Filename not valid');
        }


        this.filename = filename;
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
     * Save a value to a private namespace ("data") that does not interfere with
     * the userdata namespace.
     *
     * @param {string} key
     * @param {object|string} value
     * @param {function} callback
     */
    save(key, value, callback) {
        this.saveFullObject(`data.${key}`, value, callback);
    }

    /**
     * Gets value from db from the private namespace "data".
     *
     * @param {string} key
     * @param {function} callback
     */
    load(key, callback) {
        let that = this;

        this.loadObject(function(err, item) {
          if (err) {
            callback(err, item);
            return;
          }
          if (!_.get(item, `data.${key}`)) {
              callback(createDataKeyNotFoundError(that.mainKey, key), null);
              return;
          }

          callback(err, item['data'][key]);
        });
    }

    /**
     * Loads complete user object from db. Returns all namespaces.
     *
     * @param {func} callback
     */
    loadObject(callback) {
        let mainKey = this.mainKey;

        let filename = this.filename;
        if (!fs.existsSync(path.dirname(filename))) {
            mkDirByPathSync(path.dirname(filename));
        }
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '[]');
        }

        fs.readFile(this.filename, 'utf8', function(err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            let userArray = data.length > 0 ? JSON.parse(data) : [];

            let itemIndex = -1;
            for (let i = 0; i < userArray.length; i++) {
                let item = userArray[i];
                if (item.userId === mainKey) {
                    itemIndex = i;
                }
            }

            if (itemIndex === -1) {
                callback(createMainKeyNotFoundError(mainKey), null);
                return;
            }

            callback(err, userArray[itemIndex]);
        });
    }

    /**
     * Saves complete column object 'user' OR 'userData'
     *
     * @param {string} key The main key chosen ("namespace")
     * @param {object|string} newData
     * @param {function} callback
     */
    saveFullObject(key, newData, callback) {
        let filename = this.filename;
        if (!fs.existsSync(path.dirname(filename))) {
            mkDirByPathSync(path.dirname(filename));
        }
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '[]');
        }
        let mainKey = this.mainKey;

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            let userArray = data.length > 0 ? JSON.parse(data) : [];

            let existingItem = false;
            for (let i = 0; i < userArray.length; i++) {
                let item = userArray[i];
                if (item.userId === mainKey) {
                    _.set(item, key, newData);
                    existingItem = true;
                }
            }
            if (!existingItem) {
                let newItem = {
                    userId: mainKey,
                };
                _.set(newItem, key, newData);
                userArray.push(newItem);
            }

            fs.writeFile(filename, JSON.stringify(userArray, null, '\t'), function(err) {
                callback(err);
            });
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
            let fileObj = data.length > 0 ? JSON.parse(data) : [];

            let itemIndex = -1;
            for (let i = 0; i < fileObj.length; i++) {
                let item = fileObj[i];
                if (item.userId === mainKey) {
                    itemIndex = i;
                }
            }

            if (itemIndex < 0) {
                callback(createMainKeyNotFoundError(mainKey), null);
                return;
            }

            delete fileObj[itemIndex];
            fileObj = fileObj.filter((n) => true);

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

            let itemIndex = -1;
            for (let i = 0; i < fileObj.length; i++) {
                let item = fileObj[i];
                if (item.userId === mainKey) {
                    itemIndex = i;
                }
            }

            if (itemIndex < 0) {
                callback(createMainKeyNotFoundError(mainKey), false);
                return;
            }

            if (typeof fileObj[itemIndex]['data'][key] === 'undefined') {
              callback(createDataKeyNotFoundError(mainKey, key), null);
              return;
            }

            delete fileObj[itemIndex]['data'][key];

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
 * Creates paths recursively
 * @param {string} targetDir
 * @param {boolean} isRelativeToScript
 */
function mkDirByPathSync(targetDir, isRelativeToScript) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
                console.log(`Directory ${curDir} created!`);
            }
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }

            console.log(`Directory ${curDir} already exists!`);
        }

        return curDir;
    }, initDir);
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
