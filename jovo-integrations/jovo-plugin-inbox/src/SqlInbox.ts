import { Log, PluginConfig, Project } from 'jovo-core';
import _merge = require('lodash.merge');
import { JovoInboxDb } from './interfaces';
import * as path from 'path';
import { createConnection, getConnectionManager, ConnectionOptions, getConnection } from 'typeorm';
import { InboxLogEntity } from './entity/InboxLog';

export class SqlInbox implements JovoInboxDb {
  config: ConnectionOptions = {
    type: 'sqlite',
    synchronize: true,
    logging: false,
    database: 'database.sqlite',
    entities: [InboxLogEntity],
  };

  constructor(config?: Partial<ConnectionOptions>) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  async init() {
    if (getConnectionManager().connections.length === 0) {
      await createConnection(this.config);
    }
  }
  errorHandling() {}
  async add(inboxLog: InboxLogEntity) {
    await this.init();
    this.errorHandling();

    try {
      await getConnection().manager.save(inboxLog);
    } catch (e) {
      console.log(e);
    }
  }

  async close() {
    try {
      getConnection().close();
    } catch (e) {
      console.log(e);
    }
  }
}
