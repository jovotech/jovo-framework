import { BaseApp } from 'jovo-core';
import { MongoDb } from 'jovo-db-mongodb';
import _set = require('lodash.set');

import { CosmosDb } from '../src/CosmosDb';
describe('test install()', () => {
    describe('test install() setting app.$db', () => {
        beforeAll(() => {
            // mock methods, which are called with super.install()
            MongoDb.prototype.errorHandling = jest.fn();
            MongoDb.prototype.install = jest.fn();
        });
        test('test should set app.$db to be CosmosDb if no default db was set in config', async () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();

            await cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should not be an instance of CosmosDb if default db set in config is not CosmosDb', async () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'test');

            await cosmosdb.install(app);

            expect(app.$db).not.toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should be an instance CosmosDb if default db is set to CosmosDb', async () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'CosmosDb');

            await cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });
    });
});
