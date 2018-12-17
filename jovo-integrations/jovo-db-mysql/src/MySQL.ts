
import {Db, BaseApp, PluginConfig} from 'jovo-core';
import _merge = require('lodash.merge');
import * as mysql from 'mysql';
import {Connection, ConnectionConfig, MysqlError} from "mysql";

export interface Config extends PluginConfig {
    tableName?: string;
    primaryKeyColumn?: string;
    dataColumnName?: string;
    connection?: string | ConnectionConfig;
}

export class MySQL implements Db {
    config: Config = {
        tableName: 'users',
        primaryKeyColumn: 'userId',
        dataColumnName: 'userData',
    };
    connection?: Connection;
    needsWriteFileAccess = false;

    constructor(config?: Config) {

        if (config) {
            this.config = _merge(this.config, config);
        }


    }

    install(app: BaseApp) {
        if (!this.config.connection) {
            throw new Error('A connection config is needed.');
        }

        this.connection = mysql.createConnection(this.config.connection);
        this.connection.connect();
        app.$db = this;
        // TODO: disconnect on FINALIZE?
    }

    uninstall(app: BaseApp) {

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
                console.log(err);
            }
        }

    }

    async save(primaryKey: string, key: string, data: object) {
        return await this.insert(primaryKey, data);
    }

    async delete(primaryKey: string) {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line
            if (!this.connection) {
                return reject(new Error('Connection is not established'));
            }
            this.connection.query(
                `DELETE FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
                [primaryKey],
                (error: MysqlError | null, results: any) => { // tslint:disable-line
                    if(error) {
                        return reject(error);
                    }
                    resolve(results);

                });
        });
    }

    private async createTable() {
        return this.create();
    }

    private insert(primaryKey: string, data: object) {
        return new Promise((resolve, reject) => {
            if (!this.config.primaryKeyColumn) {
                return reject(new Error('PrimaryKeyColumn must be set'));
            }
            if (!this.config.dataColumnName) {
                return reject(new Error('dataColumnName must be set'));
            }

            if (!this.connection) {
                return reject(new Error('Connection is not established'));
            }
            // tslint:disable-next-line
            this.connection.query(`INSERT INTO ${this.config.tableName} SET ? ON DUPLICATE KEY UPDATE ${this.config.dataColumnName}='${JSON.stringify(data)}'`, {[this.config.primaryKeyColumn] : primaryKey, userData: JSON.stringify(data)}, (error: MysqlError | null, results: any) => {
                if(error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }


    private select(primaryKey: string) {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line
            if (!this.connection) {
                return reject(new Error('Connection is not established'));
            }

            this.connection.query(
                `SELECT * FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`,
                [primaryKey],
                (error: MysqlError | null, results: any) => { // tslint:disable-line
                if(error) {
                    return reject(error);
                }
                if (!this.config.dataColumnName) {
                    return reject(new Error('dataColumnName must be set'));
                }


                if (results.length === 0) {
                    return resolve({[this.config.dataColumnName]: {}});
                }

                try {
                    resolve({ [this.config.dataColumnName]: JSON.parse(results[0][this.config.dataColumnName])});
                } catch (e) {
                    reject(e);
                }

            });
        });
    }

    private create() {

        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject(new Error('Connection is not established'));
            }
            if (!this.config.dataColumnName) {
                return reject(new Error('dataColumnName must be set'));
            }
            const sql = `
                    CREATE TABLE ${this.config.tableName} (${this.config.primaryKeyColumn} VARCHAR(200) NOT NULL,
                    ${this.config.dataColumnName} TEXT NULL,
                    PRIMARY KEY (${this.config.primaryKeyColumn}));
            `;
            // tslint:disable-next-line
            this.connection.query(sql, (error: MysqlError, results: any) => {
                if(error) {
                    return reject(error);
                }
                resolve(results);

            });
        });
    }

}
