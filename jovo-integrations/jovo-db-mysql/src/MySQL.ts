
import {Db, BaseApp, PluginConfig} from 'jovo-core';
import * as _ from "lodash";
import * as mysql from 'mysql';
import {Connection, ConnectionConfig, MysqlError} from "mysql";

export interface Config extends PluginConfig {
    primaryKeyColumn?: string;
    connection?: string | ConnectionConfig;
}

export class MySQL implements Db {
    config: Config = {
        primaryKeyColumn: 'userId',
    };
    connection: Connection;
    tableName: string;
    needsWriteFileAccess = false;

    constructor(tableName: string, config?: Config) {

        if (config) {
            this.config = _.merge(this.config, config);
        }

        this.tableName = tableName;
        //
        if (!this.config.connection) {
            throw new Error('A connection config is needed.');
        }

        this.connection = mysql.createConnection(this.config.connection);
        this.connection.connect();
    }

    install(app: BaseApp) {
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
    }

    private async createTable() {
        return this.create();
    }


    private insert(primaryKey: string, data: object) {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line
            this.connection.query(`INSERT INTO users SET ? ON DUPLICATE KEY UPDATE userData='${JSON.stringify(data)}'`, {userId : primaryKey, userData: JSON.stringify(data)}, (error: MysqlError | null, results: any) => {
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
            this.connection.query('SELECT * FROM users WHERE userId = ?', [primaryKey], (error: MysqlError | null, results: any) => {
                if(error) {
                    return reject(error);
                }
                resolve(results);

            });
        });
    }

    private create() {
        return new Promise((resolve, reject) => {

            const sql = `
                    CREATE TABLE ${this.tableName} (${this.config.primaryKeyColumn} VARCHAR(200) NOT NULL,
                    userData TEXT NULL,
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
