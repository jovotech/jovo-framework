import {Db, PluginConfig, BaseApp} from 'jovo-core';
import * as path from 'path';
import * as fs from "fs";
import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');

interface Config extends PluginConfig {
    pathToFile: string;
    primaryKeyColumn: string;
}

export class FileDb implements Db {
    needsWriteFileAccess = true;

    config: Config = {
        pathToFile: './../db/db.json',
        primaryKeyColumn: 'userId',
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        const pathToFile: string = this.config.pathToFile;
        FileDb.validatePathToFile(this.config);

        _set(this, 'config.pathToFile', pathToFile);
        // create file
        try {
            if (!fs.existsSync(path.dirname(pathToFile))) {
                FileDb.mkDirByPathSync(path.dirname(pathToFile), false);
            }
            if (!fs.existsSync(pathToFile)) {
                fs.writeFileSync(pathToFile, '[]');
                console.log(`############################################`);
                console.log(`#  Local FileDB ${pathToFile} created!  #`);
                console.log(`############################################`);
                console.log();
            }

            app.$db = this;
        } catch (e) {

        }

    }

    uninstall(app: BaseApp) {

    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string) {
        const data: any = await this.readFile(this.config.pathToFile); // tslint:disable-line
        const users = data.length > 0 ? JSON.parse(data) : [];
        const userData = users.find((o:any) => { // tslint:disable-line
            return o[this.config.primaryKeyColumn] === primaryKey;
        });

        return Promise.resolve(userData);
    }

    async save(primaryKey: string, key: string, data: any) { // tslint:disable-line
        const oldData: any = await this.readFile(this.config.pathToFile); // tslint:disable-line
        const users = oldData.length > 0 ? JSON.parse(oldData) : [];

        // find data for user with this primaryKey
        const userData = users.find((o:any) => { // tslint:disable-line
            return o[this.config.primaryKeyColumn] === primaryKey;
        });

        if(userData) {
            _set(userData, key, data);
        } else {
            const newData: any = {}; // tslint:disable-line
            newData[this.config.primaryKeyColumn] = primaryKey;
            _set(newData, key, data);
            users.push(newData);
        }
        return this.saveFile(this.config.pathToFile, users);
    }

    async delete(primaryKey: string) {
        const data: any = await this.readFile(this.config.pathToFile); // tslint:disable-line
        const users = data.length > 0 ? JSON.parse(data) : [];
        let rowsAffected = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i][this.config.primaryKeyColumn] === primaryKey) {
                delete users[i];
                rowsAffected++;
            }
        }
        await this.saveFile(this.config.pathToFile, users);
        return Promise.resolve(rowsAffected);
    }


    private async readFile(filename: string) {
        return new Promise<any>((resolve, reject) => { // tslint:disable-line
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    private async saveFile(filename: string, data: any) { // tslint:disable-line
        return new Promise<any>((resolve, reject) => { // tslint:disable-line
            fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    private static validatePathToFile(config: any) { // tslint:disable-line
        if (!_get(config, 'pathToFile')) {
            throw Error('InitializationError: pathToFile not set');
        }

        if ((/[^a-z0-9_/\.:\\-]/gi).test(config.pathToFile)) {
            throw Error('InitializationError: pathToFile not valid');
        }

        if (path.extname(config.pathToFile) !== '.json') {
            throw Error('InitializationError: Invalid file FileDB extension. Must be .json');
        }
    }

    /**
     * Creates paths recursively
     * @param {string} targetDir
     * @param {boolean} isRelativeToScript
     */
    private static mkDirByPathSync(targetDir: string, isRelativeToScript: boolean) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';

        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                if (!fs.existsSync(curDir)) {
                    fs.mkdirSync(curDir);
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

}
