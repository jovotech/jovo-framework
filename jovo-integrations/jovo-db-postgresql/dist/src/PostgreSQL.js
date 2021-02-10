"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const pg_1 = require("pg");
const jovo_core_1 = require("jovo-core");
class PostgreSQL {
    constructor(config) {
        this.config = {
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
            throw new jovo_core_1.JovoError('A connection config is needed.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-postgresql', 'PostgreSQL connection configuration has to be set correctly.', 'https://www.jovo.tech/marketplace/jovo-db-postgresql#installation');
        }
        this.pool = new pg_1.Pool(this.config.connection);
        this.setAsActiveDbIntegration(app);
    }
    async uninstall(app) {
        if (this.pool) {
            await this.pool.end();
            jovo_core_1.Log.verbose('PostgreSQL connection pool released.');
        }
    }
    /**
     * Returns object for given `primaryKey`
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        this.errorHandling();
        try {
            // string interpolation has to be enclosed in "" or the string will be set to lowercase
            const sqlQuery = `SELECT * FROM ${this.config.tableName} WHERE "${this.config.primaryKeyColumn}" = $1`;
            const result = await this.pool.query(sqlQuery, [primaryKey]);
            if (result.rowCount > 0) {
                return {
                    [this.config.dataColumnName]: JSON.parse(result.rows[0][this.config.dataColumnName]),
                };
            }
            else {
                return {};
            }
        }
        catch (err) {
            /**
             * 42P01 -> undefined table
             * see https://www.postgresql.org/docs/12/errcodes-appendix.html for list of error codes
             */
            if (err.code === '42P01') {
                await this.createTable();
            }
            else {
                throw err;
            }
        }
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        this.errorHandling();
        // string interpolation has to be enclosed in "" or the string will be set to lowercase
        const sqlQuery = `INSERT INTO ${this.config.tableName} VALUES ($1, $2) ON CONFLICT ("${this.config.primaryKeyColumn}") DO UPDATE SET "${this.config.dataColumnName}" = excluded."${this.config.dataColumnName}";`;
        await this.pool.query(sqlQuery, [primaryKey, JSON.stringify(data)]);
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        // string interpolation has to be enclosed in "" or the string will be set to lowercase
        const sqlQuery = `DELETE FROM ${this.config.tableName} WHERE "${this.config.primaryKeyColumn}" = $1`;
        await this.pool.query(sqlQuery, [primaryKey]);
    }
    /**
     * Sets PostgreSQL as the active db integration if there is no default db
     * or the default db is set to be `PostgreSQL`.
     * @param app
     */
    setAsActiveDbIntegration(app) {
        var _a, _b;
        if ((_a = app.config.db) === null || _a === void 0 ? void 0 : _a.default) {
            if (((_b = app.config.db) === null || _b === void 0 ? void 0 : _b.default) === 'PostgreSQL') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
    errorHandling() {
        if (!this.config.dataColumnName) {
            throw new jovo_core_1.JovoError('dataColumnName must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-postgresql', undefined, undefined, 'https://www.jovo.tech/marketplace/jovo-db-postgresql#installation');
        }
        if (!this.config.primaryKeyColumn) {
            throw new jovo_core_1.JovoError('primaryKeyColumn must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-postgresql', undefined, undefined, 'https://www.jovo.tech/marketplace/jovo-db-postgresql#installation');
        }
        if (!this.config.tableName) {
            throw new jovo_core_1.JovoError('tableName must be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-postgresql', undefined, undefined, 'https://www.jovo.tech/marketplace/jovo-db-postgresql#installation');
        }
    }
    async createTable() {
        // string interpolation has to be enclosed in "" or the string will be set to lowercase
        const sqlQuery = `CREATE TABLE ${this.config.tableName} ("${this.config.primaryKeyColumn}" VARCHAR(255) NOT NULL, "${this.config.dataColumnName}" text NULL, PRIMARY KEY ("${this.config.primaryKeyColumn}"));`;
        await this.pool.query(sqlQuery);
    }
}
exports.PostgreSQL = PostgreSQL;
//# sourceMappingURL=PostgreSQL.js.map