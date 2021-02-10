"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const mysql = require("mysql");
class MySQL {
    constructor(config) {
        this.config = {
            connection: undefined,
            dataColumnName: 'userData',
            primaryKeyColumn: 'userId',
            tableName: 'users',
        };
        this.needsWriteFileAccess = false;
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        if (!this.config.connection) {
            throw new jovo_core_1.JovoError('A connection config is needed.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql', undefined, 'MySQL connection configuration has to be set correctly.', 'https://www.jovo.tech/docs/databases/mysql');
        }
        this.pool = mysql.createPool(this.config.connection);
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'MySQL') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
    uninstall(app) {
        if (this.pool) {
            this.pool.end(() => {
                jovo_core_1.Log.verbose('MySQL Connection pool released.');
            });
        }
    }
    errorHandling() {
        if (!this.config.dataColumnName) {
            throw new jovo_core_1.JovoError('dataColumnName must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql', undefined, undefined, 'https://www.jovo.tech/docs/databases/mysql');
        }
        if (!this.config.primaryKeyColumn) {
            throw new jovo_core_1.JovoError('primaryKeyColumn must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql', undefined, undefined, 'https://www.jovo.tech/docs/databases/mysql');
        }
        if (!this.config.tableName) {
            throw new jovo_core_1.JovoError('tableName must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql', undefined, undefined, 'https://www.jovo.tech/docs/databases/mysql');
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        try {
            return await this.select(primaryKey);
        }
        catch (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                await this.createTable();
            }
            else {
                throw err;
            }
        }
    }
    save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await this.getConnection();
                // Use the connection
                const query = connection.query(`INSERT INTO ${this.config.tableName} SET ? ON DUPLICATE KEY UPDATE ${this.config.dataColumnName}=?`, [
                    {
                        [this.config.primaryKeyColumn]: primaryKey,
                        [this.config.dataColumnName]: JSON.stringify(data),
                    },
                    JSON.stringify(data),
                ], (error, results) => {
                    // tslint:disable-line
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
                jovo_core_1.Log.verbose('SQL STATEMENT: ' + query.sql);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await this.getConnection();
                const query = connection.query(`DELETE FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`, [primaryKey], (error, results) => {
                    // tslint:disable-line
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
                jovo_core_1.Log.verbose('SQL STATEMENT: ' + query.sql);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    createTable() {
        // tslint:disable-line
        this.errorHandling();
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await this.getConnection();
                const sql = `
                    CREATE TABLE ${this.config.tableName} (${this.config.primaryKeyColumn} VARCHAR(255) NOT NULL,
                    ${this.config.dataColumnName} MEDIUMTEXT NULL,
                    PRIMARY KEY (${this.config.primaryKeyColumn}));
                    `;
                const query = connection.query(sql, (error, results) => {
                    // tslint:disable-line
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
                jovo_core_1.Log.verbose('SQL STATEMENT: ' + query.sql);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    select(primaryKey) {
        this.errorHandling();
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await this.getConnection();
                // Use the connection
                const query = connection.query(`SELECT * FROM ${this.config.tableName} WHERE ${this.config.primaryKeyColumn} = ?`, [primaryKey], (error, results) => {
                    // tslint:disable-line
                    if (error) {
                        return reject(error);
                    }
                    if (results.length === 0) {
                        return resolve();
                    }
                    try {
                        resolve({
                            [this.config.dataColumnName]: JSON.parse(results[0][this.config.dataColumnName]),
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                    connection.release();
                });
                jovo_core_1.Log.verbose('SQL STATEMENT: ' + query.sql);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getConnection() {
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                return reject(new jovo_core_1.JovoError('Connection could not be established.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql', undefined, undefined, 'https://www.jovo.tech/docs/databases/mysql'));
            }
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mysql'));
                }
                resolve(connection);
            });
        });
    }
}
exports.MySQL = MySQL;
//# sourceMappingURL=MySQL.js.map