import _merge = require('lodash.merge');
import { ConnectionConfig, Pool } from 'pg';

import { BaseApp, Db, ErrorCode, Jovo, JovoError, Log, PluginConfig } from 'jovo-core';

export interface Config extends PluginConfig {
  tableName?: string;
  primaryKeyColumn?: string;
  dataColumnName?: string;
  connection?: ConnectionConfig;
}

export class PostgreSQL implements Db {
  config: Config = {
    dataColumnName: 'userData',
    primaryKeyColumn: 'userId',
    tableName: 'users',
  };
  /**
   * We use single queries using the pool object as it's the recommended way of doing things
   * when you only need a small number of queries. In our case that's two queries
   * per request-response cycle.
   * @see https://node-postgres.com/features/pooling#single-query
   */
  pool!: Pool; // initialized in install() not constructor

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
        'jovo-db-postgresql',
        'PostgreSQL connection configuration has to be set correctly.',
        'https://v3.jovo.tech/marketplace/jovo-db-postgresql#installation',
      );
    }

    this.pool = new Pool(this.config.connection);

    this.setAsActiveDbIntegration(app);
  }

  async uninstall(app: BaseApp) {
    if (this.pool) {
      await this.pool.end();
      Log.verbose('PostgreSQL connection pool released.');
    }
  }

  /**
   * Returns object for given `primaryKey`
   * @param {string} primaryKey
   * @return {Promise<any>}
   */
  async load(primaryKey: string, jovo?: Jovo): Promise<any> {
    this.errorHandling();

    try {
      // string interpolation has to be enclosed in "" or the string will be set to lowercase
      const sqlQuery = `SELECT * FROM ${this.config.tableName} WHERE "${this.config.primaryKeyColumn}" = $1`;
      const result = await this.pool.query(sqlQuery, [primaryKey]);

      if (result.rowCount > 0) {
        return {
          [this.config.dataColumnName!]: JSON.parse(result.rows[0][this.config.dataColumnName!]),
        };
      } else {
        return {};
      }
    } catch (err) {
      /**
       * 42P01 -> undefined table
       * see https://www.postgresql.org/docs/12/errcodes-appendix.html for list of error codes
       */
      if (err.code === '42P01') {
        await this.createTable();
      } else {
        throw err;
      }
    }
  }

  async save(
    primaryKey: string,
    key: string,
    data: any,
    updatedAt?: string,
    jovo?: Jovo,
  ): Promise<void> {
    this.errorHandling();

    // string interpolation has to be enclosed in "" or the string will be set to lowercase
    const sqlQuery = `INSERT INTO ${this.config.tableName} VALUES ($1, $2) ON CONFLICT ("${this.config.primaryKeyColumn}") DO UPDATE SET "${this.config.dataColumnName}" = excluded."${this.config.dataColumnName}";`;

    await this.pool.query(sqlQuery, [primaryKey, JSON.stringify(data)]);
  }

  async delete(primaryKey: string, jovo?: Jovo): Promise<void> {
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
  private setAsActiveDbIntegration(app: BaseApp) {
    if (app.config.db?.default) {
      if (app.config.db?.default === 'PostgreSQL') {
        app.$db = this;
      }
    } else {
      app.$db = this;
    }
  }

  private errorHandling() {
    if (!this.config.dataColumnName) {
      throw new JovoError(
        'dataColumnName must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-postgresql',
        undefined,
        undefined,
        'https://v3.jovo.tech/marketplace/jovo-db-postgresql#installation',
      );
    }

    if (!this.config.primaryKeyColumn) {
      throw new JovoError(
        'primaryKeyColumn must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-postgresql',
        undefined,
        undefined,
        'https://v3.jovo.tech/marketplace/jovo-db-postgresql#installation',
      );
    }

    if (!this.config.tableName) {
      throw new JovoError(
        'tableName must be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-db-postgresql',
        undefined,
        undefined,
        'https://v3.jovo.tech/marketplace/jovo-db-postgresql#installation',
      );
    }
  }

  private async createTable(): Promise<void> {
    // string interpolation has to be enclosed in "" or the string will be set to lowercase
    const sqlQuery = `CREATE TABLE ${this.config.tableName} ("${this.config.primaryKeyColumn}" VARCHAR(255) NOT NULL, "${this.config.dataColumnName}" text NULL, PRIMARY KEY ("${this.config.primaryKeyColumn}"));`;

    await this.pool.query(sqlQuery);
  }
}
