import * as fs from 'fs';
import { BaseApp, Db, ErrorCode, Jovo, JovoError, Log, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import * as path from 'path';

export interface Config extends PluginConfig {
  pathToFile?: string;
  primaryKeyColumn?: string;
}

export class FileDb implements Db {
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

        Log.error(`Directory ${curDir} already exists!`);
      }

      return curDir;
    }, initDir);
  }

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
    const pathToFile = this.config.pathToFile;
    FileDb.validatePathToFile(this.config);

    _set(this, 'config.pathToFile', pathToFile);
    // create file
    try {
      if (!fs.existsSync(path.dirname(pathToFile!))) {
        FileDb.mkDirByPathSync(path.dirname(pathToFile!), false);
      }
      if (!fs.existsSync(pathToFile!)) {
        fs.writeFileSync(pathToFile!, '[]');
        Log.info(Log.header('INFO: Local FileDb', 'db-filedb'));

        Log.info(`${path.resolve(pathToFile!)} created!`);
        Log.info();

        Log.info('More Info: >> https://v3.jovo.tech/docs/databases/file-db');

        Log.info(Log.header());
      }

      app.$db = this;
    } catch (e) {
      Log.error(e);
    }
  }

  errorHandling() {
    if (!fs.existsSync(this.config.pathToFile!)) {
      throw new JovoError(
        `File db ${this.config.pathToFile} does not exist.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-filedb',
        undefined,
        `Restart the Jovo app. ${this.config.pathToFile} will be created automatically.`,
      );
    }
  }

  /**
   * Returns object for given primaryKey
   * @param {string} primaryKey
   * @return {Promise<any>}
   */
  async load(primaryKey: string, jovo?: Jovo) {
    this.errorHandling();

    Log.verbose(`Loading data from: ${this.config.pathToFile}`);
    const data: any = await this.readFile(this.config.pathToFile!); // tslint:disable-line
    const users = data.length > 0 ? JSON.parse(data) : [];
    const userData = users.find((o: any) => {
      // tslint:disable-line
      return o[this.config.primaryKeyColumn!] === primaryKey;
    });

    return Promise.resolve(userData);
  }

  async save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo) {
    // tslint:disable-line
    this.errorHandling();

    const oldData: any = await this.readFile(this.config.pathToFile!); // tslint:disable-line
    const users = oldData.length > 0 ? JSON.parse(oldData) : [];

    // find data for user with this primaryKey
    const userData = users.find((o: any) => {
      // tslint:disable-line
      return o[this.config.primaryKeyColumn!] === primaryKey;
    });

    if (userData) {
      _set(userData, key, data);
      if (updatedAt) {
        userData.updatedAt = updatedAt;
      }
    } else {
      const newData = {
        [this.config.primaryKeyColumn!]: primaryKey,
        [key]: data,
      };
      if (updatedAt) {
        newData.updatedAt = updatedAt;
      }

      users.push(newData);
    }
    Log.verbose(`Saving data to: ${this.config.pathToFile}`);

    return this.saveFile(this.config.pathToFile!, users);
  }

  async delete(primaryKey: string, jovo?: Jovo) {
    this.errorHandling();

    const data: any = await this.readFile(this.config.pathToFile!); // tslint:disable-line
    let users = data.length > 0 ? JSON.parse(data) : [];
    let rowsAffected = 0;
    for (let i = 0; i < users.length; i++) {
      if (users[i][this.config.primaryKeyColumn!] === primaryKey) {
        delete users[i];
        rowsAffected++;
      }
    }
    users = users.filter((n: object) => n); // remove null

    await this.saveFile(this.config.pathToFile!, users);
    return Promise.resolve(rowsAffected);
  }

  private async readFile(filename: string) {
    return new Promise<any>((resolve, reject) => {
      // tslint:disable-line
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  private async saveFile(filename: string, data: any) {
    // tslint:disable-line
    return new Promise<any>((resolve, reject) => {
      // tslint:disable-line
      fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  private static validatePathToFile(config: any) {
    // tslint:disable-line
    if (!_get(config, 'pathToFile')) {
      throw new JovoError(
        'InitializationError: pathToFile not set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-filedb',
      );
    }

    if (/[^a-z0-9_/\.:\\-]/gi.test(config.pathToFile)) {
      throw new JovoError(
        'InitializationError: pathToFile not valid.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-filedb',
      );
    }

    if (path.extname(config.pathToFile) !== '.json') {
      throw new JovoError(
        'InitializationError: Invalid file FileDB extension. It must be .json',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-filedb',
      );
    }
  }
}
