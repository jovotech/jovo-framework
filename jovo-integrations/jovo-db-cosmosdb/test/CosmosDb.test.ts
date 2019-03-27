import { BaseApp } from "jovo-core";
import { CosmosDb } from "../src/CosmosDb";
import _set = require('lodash.set');

describe('test install()', () => {
    describe('test install() setting app.$db', () => {
        test('test should set app.$db to be CosmosDb if no default db was set in config', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();

            cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should not be an instance of CosmosDb if default db set in config is not CosmosDb', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'test');

            cosmosdb.install(app);

            expect(app.$db).not.toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should be an instance CosmosDb if default db is set to CosmosDb', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'CosmosDb');

            cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });
    });
});
