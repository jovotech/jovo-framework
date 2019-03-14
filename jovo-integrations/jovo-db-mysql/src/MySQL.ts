
import {Db, BaseApp, PluginConfig, ErrorCode, JovoError, Log} from 'jovo-core';
import _merge = require('lodash.merge');
import * as mysql from 'mysql';
import {MysqlError, Pool, PoolConnection, PoolConfig} from "mysql";

export interface Config extends PluginConfig {
    tableName?: string;
    primaryKeyColumn?: string;
    dataColumnName?: string;
    connection?: string | PoolConfig;
}

export class MySQL implements Db {
    config: Config = {
        tableName: 'users',
        primaryKeyColumn: 'userId',
        dataColumnName: 'userData',
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
                'https://www.jovo.tech/docs/databases/mysql');
        }
        this.pool = mysql.createPool(this.config.connection);
        app.$db = this;
    }

    uninstall(app: BaseApp) {
        if (this.pool) {
            this.pool.end(() => {
                Log.verbose('MySQL Connection pool released.');
            });
        }
    }

    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string) {
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

    async save(primaryKey: string, key: string, data: object) {
        return await this.insert(primaryKey, data);
    }

    async delete(primaryKey: string) {
        return new Promise(async (resolve, reject) => {

            try {
                const connection: PoolConnection = await this.getConnection();

                const query = connection.query(
                    `DELETE FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
                    [primaryKey],
                    (error: MysqlError | null, results: any) => { // tslint:disable-line
                        if(error) {
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

    private async createTable() {
        return this.create();
    }

    private insert(primaryKey: string, data: object) {
        return new Promise(async (resolve, reject) => {
            if (!this.config.primaryKeyColumn) {
                return reject(new JovoError(
                    'PrimaryKeyColumn must be set.',
                    ErrorCode.ERR_PLUGIN,
                    'jovo-db-mysql',
                    undefined,
                    undefined,
                    'https://www.jovo.tech/docs/databases/mysql'));
            }
            if (!this.config.dataColumnName) {

                return reject(new JovoError(
                    'dataColumnName must be set.',
                    ErrorCode.ERR_PLUGIN,
                    'jovo-db-mysql',
                    undefined,
                    undefined,
                    'https://www.jovo.tech/docs/databases/mysql'));
            }

            try {
                const connection: PoolConnection = await this.getConnection();

                // Use the connection
                const query = connection.query(`INSERT INTO ${this.config.tableName} SET ? ON DUPLICATE KEY UPDATE ${this.config.dataColumnName}=?`,
                    [{
                        [this.config.primaryKeyColumn!] : primaryKey,
                        [this.config.dataColumnName!]: JSON.stringify(data)
                    },
                        JSON.stringify(data)],
                    (error: MysqlError | null, results: any) => { // tslint:disable-line

                        if(error) {
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


    private select(primaryKey: string) {
        return new Promise(async (resolve, reject) => {

            try {
                const connection: PoolConnection = await this.getConnection();

                // Use the connection
                const query = connection.query(
                    `SELECT * FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
                    [primaryKey],
                    (error: MysqlError | null, results: any) => { // tslint:disable-line
                        if(error) {
                            return reject(error);
                        }
                        if (!this.config.dataColumnName) {
                            return reject(new JovoError(
                                'dataColumnName must be set.',
                                ErrorCode.ERR_PLUGIN,
                                'jovo-db-mysql',
                                undefined,
                                undefined,
                                'https://www.jovo.tech/docs/databases/mysql'));
                        }


                        if (results.length === 0) {
                            return resolve();
                        }

                        try {
                            resolve({ [this.config.dataColumnName]: JSON.parse(results[0][this.config.dataColumnName])});
                        } catch (e) {
                            reject(e);
                        }
                        connection.release();
                    });

                Log.verbose('SQL STATEMENT: ' + query.sql);
            } catch (e) {
                reject(e);
            }
        });

    }

    private getConnection(): Promise<PoolConnection> {
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                throw new JovoError(
                    'Connection could not be established.',
                    ErrorCode.ERR_PLUGIN,
                    'jovo-db-mysql',
                    undefined,
                    undefined,
                    'https://www.jovo.tech/docs/databases/mysql');
            }
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-db-mysql'));
                }
                resolve(connection);
            });
        });
    }



    private create() {

        return new Promise(async (resolve, reject) => {

            if (!this.config.dataColumnName) {
                return reject(new JovoError(
                    'dataColumnName must be set.',
                    ErrorCode.ERR_PLUGIN,
                    'jovo-db-mysql',
                    undefined,
                    undefined,
                    'https://www.jovo.tech/docs/databases/mysql'));
            }

            try {
                const connection: PoolConnection = await this.getConnection();

                const sql = `
                    CREATE TABLE ${this.config.tableName} (${this.config.primaryKeyColumn} VARCHAR(255) NOT NULL,
                    ${this.config.dataColumnName} MEDIUMTEXT NULL,
                    PRIMARY KEY (${this.config.primaryKeyColumn}));
                    `;

                const query = connection.query(sql, (error: MysqlError, results: any) => { // tslint:disable-line
                    if(error) {
                        return reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
                Log.verbose('SQL STATEMENT: ' + query.sql);
            } catch(e) {
                reject(e);

            }
        });
    }



}
