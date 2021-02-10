"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const path = require("path");
class FileDb2 {
    constructor(config) {
        this.needsWriteFileAccess = true;
        this.config = {
            path: './../db/',
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
                    jovo_core_1.Log.info(`Directory ${curDir} created!`);
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
        app.$db = this;
        this.errorHandling();
        if (!fs.existsSync(path.join(this.config.path))) {
            FileDb2.mkDirByPathSync(path.join(this.config.path), false);
        }
    }
    errorHandling() {
        if (!this.config.path) {
            throw new jovo_core_1.JovoError(`Couldn't use FileDb2 plugin. path is missing`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-filedb', 'config.path has a falsy value', undefined, 'https://www.jovo.tech/docs/databases/file-db');
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        this.errorHandling();
        const pathToFile = path.join(this.config.path, `${primaryKey}.json`);
        if (!fs.existsSync(pathToFile)) {
            return Promise.resolve(undefined);
        }
        const data = await this.readFile(pathToFile); // tslint:disable-line
        return Promise.resolve(JSON.parse(data));
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const pathToFile = path.join(this.config.path, `${primaryKey}.json`);
        if (fs.existsSync(pathToFile)) {
            const oldDataContent = await this.readFile(pathToFile);
            const oldData = JSON.parse(oldDataContent);
            _set(oldData, key, data);
            if (updatedAt) {
                oldData.updatedAt = updatedAt;
            }
            return this.saveFile(pathToFile, oldData);
        }
        else {
            const newData = {
                [key]: data,
            };
            if (updatedAt) {
                newData.updatedAt = updatedAt;
            }
            return this.saveFile(pathToFile, newData);
        }
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        const pathToFile = path.join(this.config.path, `${primaryKey}.json`);
        return this.deleteFile(pathToFile);
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
    async deleteFile(filename) {
        return new Promise((resolve, reject) => {
            // tslint:disable-line
            fs.unlink(filename, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}
exports.FileDb2 = FileDb2;
//# sourceMappingURL=FileDb2.js.map