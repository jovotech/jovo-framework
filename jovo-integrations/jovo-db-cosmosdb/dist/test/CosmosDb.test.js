"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const jovo_db_mongodb_1 = require("jovo-db-mongodb");
const _set = require("lodash.set");
const CosmosDb_1 = require("../src/CosmosDb");
describe('test install()', () => {
    describe('test install() setting app.$db', () => {
        beforeAll(() => {
            // mock methods, which are called with super.install()
            jovo_db_mongodb_1.MongoDb.prototype.errorHandling = jest.fn();
            jovo_db_mongodb_1.MongoDb.prototype.install = jest.fn();
        });
        test('test should set app.$db to be CosmosDb if no default db was set in config', async () => {
            const cosmosdb = new CosmosDb_1.CosmosDb();
            const app = new jovo_core_1.BaseApp();
            await cosmosdb.install(app);
            expect(app.$db).toBeInstanceOf(CosmosDb_1.CosmosDb);
        });
        test('test app.$db should not be an instance of CosmosDb if default db set in config is not CosmosDb', async () => {
            const cosmosdb = new CosmosDb_1.CosmosDb();
            const app = new jovo_core_1.BaseApp();
            _set(app.config, 'db.default', 'test');
            await cosmosdb.install(app);
            expect(app.$db).not.toBeInstanceOf(CosmosDb_1.CosmosDb);
        });
        test('test app.$db should be an instance CosmosDb if default db is set to CosmosDb', async () => {
            const cosmosdb = new CosmosDb_1.CosmosDb();
            const app = new jovo_core_1.BaseApp();
            _set(app.config, 'db.default', 'CosmosDb');
            await cosmosdb.install(app);
            expect(app.$db).toBeInstanceOf(CosmosDb_1.CosmosDb);
        });
    });
});
//# sourceMappingURL=CosmosDb.test.js.map