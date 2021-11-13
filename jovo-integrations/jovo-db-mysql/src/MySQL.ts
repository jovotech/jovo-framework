import { BaseApp, Db, ErrorCode, Jovo, JovoError, Log, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import * as mysql from 'mysql';
import { MysqlError, Pool, PoolConfig, PoolConnection } from 'mysql'; // tslint:disable-line:no-duplicate-imports

export interface Config extends PluginConfig {
  tableName?: string;
  primaryKeyColumn?: string;
  dataColumnName?: string;
  connection?: string | PoolConfig;
}

export class MySQL implements Db {
  config: Config = {
    connection: undefined,
    dataColumnName: 'userData',
    primaryKeyColumn: 'userId',
    tableName: 'users',
  };
  pool?: Pool;
  needsWriteFileAccess = false;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp) {
    if (!this.config.connection) {
      throw new JovoError(
        'A connection config is needed.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-mysql',
        undefined,
        'MySQL connection configuration has to be set correctly.',
        'https://v3.jovo.tech/docs/databases/mysql',
      );
    }
    this.pool = mysql.createPool(this.config.connection);

    if (_get(app.config, 'db.default')) {
      if (_get(app.config, 'db.default') === 'MySQL') {
        app.$db = this;
      }
    } else {
      app.$db = this;
    }
  }

  uninstall(app: BaseApp) {
    if (this.pool) {
      this.pool.end(() => {
        Log.verbose('MySQL Connection pool released.');
      });
    }
  }

  errorHandling() {
    if (!this.config.dataColumnName) {
      throw new JovoError(
        'dataColumnName must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-mysql',
        undefined,
        undefined,
        'https://v3.jovo.tech/docs/databases/mysql',
      );
    }

    if (!this.config.primaryKeyColumn) {
      throw new JovoError(
        'primaryKeyColumn must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-mysql',
        undefined,
        undefined,
        'https://v3.jovo.tech/docs/databases/mysql',
      );
    }

    if (!this.config.tableName) {
      throw new JovoError(
        'tableName must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-mysql',
        undefined,
        undefined,
        'https://v3.jovo.tech/docs/databases/mysql',
      );
    }
  }

  /**
   * Returns object for given primaryKey
   * @param {string} primaryKey
   * @return {Promise<any>}
   */
  async load(primaryKey: string, jovo?: Jovo) {
    try {
      return await this.select(primaryKey);
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        await this.createTable();
      } else {
        throw err;
      }
    }
  }

  save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo) {
    // tslint:disable-line
    this.errorHandling();

    return new Promise(async (resolve, reject) => {
      try {
        const connection: PoolConnection = await this.getConnection();

        // Use the connection
        const query = connection.query(
          `INSERT INTO ${this.config.tableName} SET ? ON DUPLICATE KEY UPDATE ${this.config.dataColumnName}=?`,
          [
            {
              [this.config.primaryKeyColumn!]: primaryKey,
              [this.config.dataColumnName!]: JSON.stringify(data),
            },
            JSON.stringify(data),
          ],
          (error: MysqlError | null, results: any) => {
            // tslint:disable-line

            if (error) {
              return reject(error);
            }
            resolve(results);
            connection.release();
          },
        );
        Log.verbose('SQL STATEMENT: ' + query.sql);
      } catch (e) {
        reject(e);
      }
    });
  }

  async delete(primaryKey: string, jovo?: Jovo) {
    this.errorHandling();

    return new Promise(async (resolve, reject) => {
      try {
        const connection: PoolConnection = await this.getConnection();

        const query = connection.query(
          `DELETE FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
          [primaryKey],
          (error: MysqlError | null, results: any) => {
            // tslint:disable-line
            if (error) {
              return reject(error);
            }
            resolve(results);
            connection.release();
          },
        );
        Log.verbose('SQL STATEMENT: ' + query.sql);
      } catch (e) {
        reject(e);
      }
    });
  }

  createTable(): Promise<any> {
    // tslint:disable-line
    this.errorHandling();

    return new Promise(async (resolve, reject) => {
      try {
        const connection: PoolConnection = await this.getConnection();

        const sql = `
                    CREATE TABLE ${this.config.tableName} (${this.config.primaryKeyColumn} VARCHAR(255) NOT NULL,
                    ${this.config.dataColumnName} MEDIUMTEXT NULL,
                    PRIMARY KEY (${this.config.primaryKeyColumn}));
                    `;

        const query = connection.query(sql, (error: MysqlError, results: any) => {
          // tslint:disable-line
          if (error) {
            return reject(error);
          }
          resolve(results);
          connection.release();
        });
        Log.verbose('SQL STATEMENT: ' + query.sql);
      } catch (e) {
        reject(e);
      }
    });
  }

  select(primaryKey: string) {
    this.errorHandling();

    return new Promise(async (resolve, reject) => {
      try {
        const connection: PoolConnection = await this.getConnection();

        // Use the connection
        const query = connection.query(
          `SELECT * FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
          [primaryKey],
          (error: MysqlError | null, results: any) => {
            // tslint:disable-line
            if (error) {
              return reject(error);
            }

            if (results.length === 0) {
              return resolve();
            }

            try {
              resolve({
                [this.config.dataColumnName!]: JSON.parse(results[0][this.config.dataColumnName!]),
              });
            } catch (e) {
              reject(e);
            }
            connection.release();
          },
        );

        Log.verbose('SQL STATEMENT: ' + query.sql);
      } catch (e) {
        reject(e);
      }
    });
  }

  getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      if (!this.pool) {
        return reject(
          new JovoError(
            'Connection could not be established.',
            ErrorCode.ERR_PLUGIN,
            'jovo-db-mysql',
            undefined,
            undefined,
            'https://v3.jovo.tech/docs/databases/mysql',
          ),
        );
      }
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-db-mysql'));
        }
        resolve(connection);
      });
    });
  }
}
