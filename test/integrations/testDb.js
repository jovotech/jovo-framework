'use strict';
let assert = require('chai').assert;
const Db = require('../../lib/integrations/db/db').Db;
let FilePersistence = require('../../lib/integrations/db/filePersistenceV2').FilePersistence;

describe('Db Class', function() {
    describe('constructor', function() {
        it('should be able to instantiate default integrations', function() {
          let db = Db.createInstance({type: 'file', localDbFilename: 'db'});
          // If it does not throw an error, everything is OK ;)

          let instance = db.use('mainkey123', 'file');
          assert.instanceOf(instance, FilePersistence);
        });
    });

    describe('use', function() {
        it.skip('should return a database by name', function() {

        });

        it.skip('should return the default database', function() {

        });
    });

    describe('addDb', function() {
        it.skip('should add another db', function() {

        });
    });
});
