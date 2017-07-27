const fs = require('fs');

/**
 * Class FilePersistence
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
                // TODO error handling
                console.log(err);
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

        fs.readFile(this.filename, 'utf8', function(err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            let fileObj = data.length > 0 ? JSON.parse(data) : {};

            if (!fileObj[mainKey]) {
                // TODO: what's best practice?
                let err = {};
                err.code = 'MAINKEYNOTFOUND';
                err.error = 'Mainkey "'+mainKey+'"not found in database';
                callback(err, null);
                return;
            }
            if (!fileObj[mainKey][key]) {
                // TODO: what's best practice?
                let err = {};
                err.code = 'DATAKEYNOTFOUND';
                err.error = 'Data key "'+key+'" not found for main key "'+mainKey+'"';
                callback(err, null);
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
                // TODO: what's best practice?
                let err = {};
                err.code = 'MAINKEYNOTFOUND';
                err.error = 'Mainkey "'+mainKey+'"not found in database';
                callback(err, false);
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
                // TODO: what's best practice?
                let err = {};
                err.code = 'MAINKEYNOTFOUND';
                err.error = 'Mainkey "'+mainKey+'"not found in database';
                callback(err, false);
                return;
            }
            if (!fileObj[mainKey][key]) {
                // TODO: what's best practice?
                let err = {};
                err.code = 'DATAKEYNOTFOUND';
                err.error = 'Data key "'+key+'" not found for main key "'+mainKey+'"';
                callback(err, null);
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

module.exports.FilePersistence = FilePersistence;

