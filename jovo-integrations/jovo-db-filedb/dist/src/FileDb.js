"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const path = require("path");
class FileDb {
    constructor(config) {
        this.needsWriteFileAccess = true;
        this.config = {
            pathToFile: './../db/db.json',
            primaryKeyColumn: 'userId',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    /**
     * Creates paths recursively
     * @param {string} targetDir
     * @param {boolean} isRelativeToScript
     */
    static mkDirByPathSync(targetDir, isRelativeToScript) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                if (!fs.existsSync(curDir)) {
                    fs.mkdirSync(curDir);
                }
            }
            catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
                jovo_core_1.Log.error(`Directory ${curDir} already exists!`);
            }
            return curDir;
        }, initDir);
    }
    install(app) {
        const pathToFile = this.config.pathToFile;
        FileDb.validatePathToFile(this.config);
        _set(this, 'config.pathToFile', pathToFile);
        // create file
        try {
            if (!fs.existsSync(path.dirname(pathToFile))) {
                FileDb.mkDirByPathSync(path.dirname(pathToFile), false);
            }
            if (!fs.existsSync(pathToFile)) {
                fs.writeFileSync(pathToFile, '[]');
                jovo_core_1.Log.info(jovo_core_1.Log.header('INFO: Local FileDb', 'db-filedb'));
                jovo_core_1.Log.info(`${path.resolve(pathToFile)} created!`);
                jovo_core_1.Log.info();
                jovo_core_1.Log.info('More Info: >> https://www.jovo.tech/docs/databases/file-db');
                jovo_core_1.Log.info(jovo_core_1.Log.header());
            }
            app.$db = this;
        }
        catch (e) {
            jovo_core_1.Log.error(e);
        }
    }
    errorHandling() {
        if (!fs.existsSync(this.config.pathToFile)) {
            throw new jovo_core_1.JovoError(`File db ${this.config.pathToFile} does not exist.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-filedb', undefined, `Restart the Jovo app. ${this.config.pathToFile} will be created automatically.`);
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        this.errorHandling();
        jovo_core_1.Log.verbose(`Loading data from: ${this.config.pathToFile}`);
        const data = await this.readFile(this.config.pathToFile); // tslint:disable-line
        const users = data.length > 0 ? JSON.parse(data) : [];
        const userData = users.find((o) => {
            // tslint:disable-line
            return o[this.config.primaryKeyColumn] === primaryKey;
        });
        return Promise.resolve(userData);
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const oldData = await this.readFile(this.config.pathToFile); // tslint:disable-line
        const users = oldData.length > 0 ? JSON.parse(oldData) : [];
        // find data for user with this primaryKey
        const userData = users.find((o) => {
            // tslint:disable-line
            return o[this.config.primaryKeyColumn] === primaryKey;
        });
        if (userData) {
            _set(userData, key, data);
            if (updatedAt) {
                userData.updatedAt = updatedAt;
            }
        }
        else {
            const newData = {
                [this.config.primaryKeyColumn]: primaryKey,
                [key]: data,
            };
            if (updatedAt) {
                newData.updatedAt = updatedAt;
            }
            users.push(newData);
        }
        jovo_core_1.Log.verbose(`Saving data to: ${this.config.pathToFile}`);
        return this.saveFile(this.config.pathToFile, users);
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        const data = await this.readFile(this.config.pathToFile); // tslint:disable-line
        let users = data.length > 0 ? JSON.parse(data) : [];
        let rowsAffected = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i][this.config.primaryKeyColumn] === primaryKey) {
                delete users[i];
                rowsAffected++;
            }
        }
        users = users.filter((n) => n); // remove null
        await this.saveFile(this.config.pathToFile, users);
        return Promise.resolve(rowsAffected);
    }
    async readFile(filename) {
        return new Promise((resolve, reject) => {
            // tslint:disable-line
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    async saveFile(filename, data) {
        // tslint:disable-line
        return new Promise((resolve, reject) => {
            // tslint:disable-line
            fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    static validatePathToFile(config) {
        // tslint:disable-line
        if (!_get(config, 'pathToFile')) {
            throw new jovo_core_1.JovoError('InitializationError: pathToFile not set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-filedb');
        }
        if (/[^a-z0-9_/\.:\\-]/gi.test(config.pathToFile)) {
            throw new jovo_core_1.JovoError('InitializationError: pathToFile not valid.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-filedb');
        }
        if (path.extname(config.pathToFile) !== '.json') {
            throw new jovo_core_1.JovoError('InitializationError: Invalid file FileDB extension. It must be .json', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-filedb');
        }
    }
}
exports.FileDb = FileDb;
//# sourceMappingURL=FileDb.js.map