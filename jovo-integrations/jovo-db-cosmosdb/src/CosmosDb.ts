import { BaseApp } from 'jovo-core';
import { Config, MongoDb } from 'jovo-db-mongodb';
import _get = require('lodash.get');

export class CosmosDb extends MongoDb {
  constructor(config?: Config) {
    super(config);
  }

  install(app: BaseApp) {
    super.install(app);
    if (_get(app.config, 'db.default')) {
      if (_get(app.config, 'db.default') === 'CosmosDb') {
        app.$db = this;
      }
    } else {
      app.$db = this;
    }
  }
}
