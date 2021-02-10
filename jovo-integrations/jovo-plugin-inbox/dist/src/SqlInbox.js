"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const typeorm_1 = require("typeorm");
const InboxLog_1 = require("./entity/InboxLog");
class SqlInbox {
    constructor(config) {
        this.config = {
            type: 'sqlite',
            synchronize: true,
            logging: false,
            database: 'database.sqlite',
            entities: [InboxLog_1.InboxLogEntity],
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    async init() {
        if (typeorm_1.getConnectionManager().connections.length === 0) {
            await typeorm_1.createConnection(this.config);
        }
    }
    errorHandling() { }
    async add(inboxLog) {
        await this.init();
        this.errorHandling();
        try {
            await typeorm_1.getConnection().manager.save(inboxLog);
        }
        catch (e) {
            console.log(e);
        }
    }
    async close() {
        try {
            typeorm_1.getConnection().close();
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.SqlInbox = SqlInbox;
//# sourceMappingURL=SqlInbox.js.map