"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_db_mongodb_1 = require("jovo-db-mongodb");
const _get = require("lodash.get");
class CosmosDb extends jovo_db_mongodb_1.MongoDb {
    constructor(config) {
        super(config);
    }
    install(app) {
        super.install(app);
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'CosmosDb') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
}
exports.CosmosDb = CosmosDb;
//# sourceMappingURL=CosmosDb.js.map